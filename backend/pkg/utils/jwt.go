package utils

import (
	"context"
	"time"

	"github.com/golang-jwt/jwt"
)

// JwtKey will be set from config during initialization
var JwtKey []byte

type Claims struct {
	UserID   uint   `json:"userID"`
	Username string `json:"username"`
	jwt.StandardClaims
}

// InitJWT initializes the JWT key from config
func InitJWT(jwtSecret string) {
	JwtKey = []byte(jwtSecret)
}

// GenerateJWT generates a new JWT token
func GenerateJWT(userID uint, username string, expiryDuration time.Duration) (string, error) {
	expirationTime := time.Now().Add(expiryDuration)
	claims := &Claims{
		UserID:   userID,
		Username: username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(JwtKey)
}

// ValidateJWT validates a token and returns claims
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

// Context key for storing user information
type contextKey string

const userContextKey contextKey = "user"

// SetUserContext adds user claims to the request context
func SetUserContext(ctx context.Context, claims *Claims) context.Context {
	return context.WithValue(ctx, userContextKey, claims)
}

// GetUserFromContext retrieves user claims from the request context
func GetUserFromContext(ctx context.Context) (*Claims, bool) {
	claims, ok := ctx.Value(userContextKey).(*Claims)
	return claims, ok
}
