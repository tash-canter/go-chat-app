package userAuthentication

import (
	"encoding/json"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

// Register new user
func RegisterUser(w http.ResponseWriter, r *http.Request) {
    var user User
    err := json.NewDecoder(r.Body).Decode(&user)
    if err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }

    // Hash the password before storing it
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        return
    }

    db := getDbConnection()
	
    // Store in database (using PostgreSQL in this example)
    _, err = db.Exec("INSERT INTO users (username, password) VALUES ($1, $2)", user.Username, string(hashedPassword))
    if err != nil {
        http.Error(w, "Could not create user", http.StatusInternalServerError)
        return
    }

    token, err := GenerateJWT(user.Username)
    if err != nil {
        http.Error(w, "Failed to generate JWT", http.StatusInternalServerError)
        return
    }

    // Respond with the JWT
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(RegisterResponse{JWT: token})
}