package userAuthentication

import (
	"time"

	"github.com/dgrijalva/jwt-go"
)

type RegisterResponse struct {
    JWT         string  `json:"jwt"`
    UserId      uint    `json:"userId"`
}

var JwtKey = []byte("your_secret_key") // Use a secure, secret key

type Claims struct {
    UserId      uint    `json:"userId"`
    Username    string  `json:"username"`
    jwt.StandardClaims
}

// Generate a new JWT token
func GenerateJWT(userId uint, username string) (string, error) {
    expirationTime := time.Now().Add(24 * time.Hour)
    claims := &Claims{
        UserId: userId,
        Username: username,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(JwtKey)
}

// Validate a token and return claims
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