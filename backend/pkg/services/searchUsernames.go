package services

import (
	"log"

	"github.com/tash-canter/go-chat-app/backend/pkg/db"
)

type User struct {
    UserID      uint   `json:"userID"`
    Username 	string `json:"username"`
}

type UsersResponse struct {
    Users []User `json:"users"`
}

func SearchUsers(username string) ([]User, error) {
    rows, err := db.Db.Query(`SELECT id, username FROM users WHERE username ILIKE $1 LIMIT 10`, username+"%")
    if err != nil {
        log.Printf("Database query error: %v", err)
        return nil, err
    }
    defer rows.Close()

    users := make([]User, 0)
    for rows.Next() {
        var user User
        if err := rows.Scan(&user.UserID, &user.Username); err != nil {
            log.Printf("Row scan error: %v", err)
            return nil, err
        }
        users = append(users, user)
    }
    
    if err := rows.Err(); err != nil {
        log.Printf("Row iteration error: %v", err)
        return nil, err
    }

    return users, nil
}