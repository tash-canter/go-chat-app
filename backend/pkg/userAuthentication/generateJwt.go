package userAuthentication

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type RegisterResponse struct {
    Username         string  `json:"username"`
    UserID              uint    `json:"userID"`
}

var JwtKey = []byte("your_secret_key") // Use a secure, secret key

type Claims struct {
    UserID      uint    `json:"userID"`
    Username    string  `json:"username"`
    jwt.StandardClaims
}

// Generate a new JWT token
func GenerateJWT(userID uint, username string) (string, error) {
    expirationTime := time.Now().Add(24 * time.Hour)
    claims := &Claims{
        UserID: userID,
        Username: username,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(JwtKey)
}

// ValiDate a token and return claims
func ValidateJWT(tokenString string) (*Claims, error) {
    claims := &Claims{}

    token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
        return JwtKey, nil
    })
    if err != nil {
        return nil, err
    }

    if !token.Valid {
        return nil, err
    }

    return claims, nil
}

// ValidateCookie validates the auth_token cookie and returns user info if valid
func ValidateCookie(w http.ResponseWriter, r *http.Request) error {
    // Extract the auth_token cookie
    cookie, err := r.Cookie("auth_token")
    if err != nil {
        http.Error(w, "No auth cookie found", http.StatusUnauthorized)
        return err
    }

    // Validate the JWT token
    claims, err := ValidateJWT(cookie.Value)
    if err != nil {
        http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
        return err
    }

    // Check if token is expired
    if time.Now().Unix() > claims.ExpiresAt {
        http.Error(w, "Token expired", http.StatusUnauthorized)
        return err
    }

    // Return user information
    w.Header().Set("Content-Type", "application/json")
    response := RegisterResponse{
        Username: claims.Username,
        UserID:   claims.UserID,
    }
    
    json.NewEncoder(w).Encode(response)
    return nil
}

// LogoutUser clears the auth_token cookie
func LogoutUser(w http.ResponseWriter, r *http.Request) error {
    // Set the cookie to expire immediately (MaxAge: -1)
    cookie := &http.Cookie{
        Name:     "auth_token",
        Value:    "",
        HttpOnly: true,
        Secure:   true,
        SameSite: http.SameSiteLaxMode,
        Path:     "/",
        MaxAge:   -1, // This makes the cookie expire immediately
    }
    http.SetCookie(w, cookie)

    // Return success response
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"message": "Logged out successfully"})
    
    return nil
}