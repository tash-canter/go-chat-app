package services

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tash-canter/go-chat-app/backend/pkg/db"
)

type User struct {
    UserID      uint   `json:"userId"`
    Username 	string `json:"username"`
}

type UsersResponse struct {
    Users []User `json:"users"`
}

func SearchUsers(w http.ResponseWriter, r *http.Request) error {
    username := r.URL.Query().Get("username") // Fetch the query parameter
    if username == "" {
        http.Error(w, "Missing 'username' query parameter", http.StatusBadRequest)
        return nil
    }
    rows, err := db.Db.Query(`SELECT id, username FROM users WHERE username ILIKE $1 LIMIT 10`, username+"%")
    if err != nil {
        http.Error(w, "failed to query users", http.StatusInternalServerError)
        return err
    }
    users := make([]User, 0)
    defer rows.Close()

    for rows.Next() {
        var user User
        if err := rows.Scan(&user.UserID, &user.Username); err != nil {
            http.Error(w, "Error reading database results", http.StatusInternalServerError)
            fmt.Println("Row scan error:", err)
            return err
        }
        users = append(users, user)
    }
    if err := rows.Err(); err != nil {
        http.Error(w, "error iterating over rows", http.StatusInternalServerError)
        return err
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(UsersResponse{Users: users})
    return nil
}