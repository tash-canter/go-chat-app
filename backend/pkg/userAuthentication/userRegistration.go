package userAuthentication

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tash-canter/go-chat-app/backend/pkg/db"
	"golang.org/x/crypto/bcrypt"
)

// Register new user
func RegisterUser(w http.ResponseWriter, r *http.Request) error {
    var user db.User
    err := json.NewDecoder(r.Body).Decode(&user)
    if err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return err
    }

    // Hash the password before storing it
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        return err
    }
	
    // Store in database (using PostgreSQL in this example)
    _, err = db.Db.Exec("INSERT INTO users (username, password) VALUES ($1, $2)", user.Username, string(hashedPassword))
    if err != nil {
        fmt.Println(err)
        http.Error(w, "Could not create user", http.StatusInternalServerError)
        return err
    }

    token, err := GenerateJWT(user.UserID, user.Username)
    if err != nil {
        http.Error(w, "Failed to generate JWT", http.StatusInternalServerError)
        return err
    }

    // Respond with the JWT
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(RegisterResponse{JWT: token, UserId: user.UserID})
    return nil
}