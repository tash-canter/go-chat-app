package userAuthentication

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tash-canter/go-chat-app/backend/pkg/db"
	"golang.org/x/crypto/bcrypt"
)

func LoginUser(w http.ResponseWriter, r *http.Request) error {
    var user db.User
    err := json.NewDecoder(r.Body).Decode(&user)
    if err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return err
    }

    // Fetch the stored user from the database
    var storedUser db.User
    err = db.Db.QueryRow("SELECT id, username, password FROM users WHERE username = $1", user.Username).Scan(&storedUser.UserID, &storedUser.Username, &storedUser.Password)
    if err != nil {
        if err == sql.ErrNoRows {
            http.Error(w, "User not found", http.StatusUnauthorized)
            return err
        }
        fmt.Println(err)
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        return err
    }

    // Compare the password with the stored hash
    err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(user.Password))
    if err != nil {
        http.Error(w, "Invalid password", http.StatusUnauthorized)
        return err
    }

    // Generate a JWT token
    token, err := GenerateJWT(storedUser.UserID, storedUser.Username)
    if err != nil {
        http.Error(w, "Could not generate token", http.StatusInternalServerError)
        return err
    }

    // Return the token as JSON
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(RegisterResponse{JWT: token, UserId: storedUser.UserID})
    return nil
}