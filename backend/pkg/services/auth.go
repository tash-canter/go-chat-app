package services

import (
	"database/sql"
	"log"
	"time"

	"github.com/tash-canter/go-chat-app/backend/pkg/db"
	"github.com/tash-canter/go-chat-app/backend/pkg/utils"
	"golang.org/x/crypto/bcrypt"
)

type RegisterResult struct {
	Username string
	UserID   uint
	Token    string
}

type LoginResult struct {
	Username string
	UserID   uint
	Token    string
}

func RegisterUser(username, password string, expiryDuration time.Duration) (*RegisterResult, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, utils.NewRegistrationError("Internal Server Error", 500)
	}

	var userID uint
	err = db.Db.QueryRow("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id", username, string(hashedPassword)).Scan(&userID)
	if err != nil {
		log.Printf("Database error during user registration: %v", err)
		return nil, utils.NewRegistrationError("Could not create user", 500)
	}

	token, err := utils.GenerateJWT(userID, username, expiryDuration)
	if err != nil {
		return nil, utils.NewRegistrationError("Failed to generate JWT", 500)
	}

	return &RegisterResult{
		Username: username,
		UserID:   userID,
		Token:    token,
	}, nil
}

func LoginUser(username, password string, expiryDuration time.Duration) (*LoginResult, error) {
	var storedUser db.User
	err := db.Db.QueryRow("SELECT id, username, password FROM users WHERE username = $1", username).Scan(&storedUser.UserID, &storedUser.Username, &storedUser.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, utils.NewLoginError("User not found", 401)
		}
		return nil, utils.NewLoginError("Internal Server Error", 500)
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(password))
	if err != nil {
		return nil, utils.NewLoginError("Invalid password", 401)
	}

	token, err := utils.GenerateJWT(storedUser.UserID, storedUser.Username, expiryDuration)
	if err != nil {
		return nil, utils.NewLoginError("Could not generate token", 500)
	}

	return &LoginResult{
		Username: storedUser.Username,
		UserID:   storedUser.UserID,
		Token:    token,
	}, nil
}
