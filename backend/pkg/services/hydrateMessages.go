package services

import (
	"encoding/json"
	"net/http"

	"github.com/tash-canter/go-chat-app/backend/pkg/db"
	"github.com/tash-canter/go-chat-app/backend/pkg/userAuthentication"
)

type MessageResponse struct {
    Messages []db.Message `json:"messages"`
}

// Register new user
func HydrateMessages(w http.ResponseWriter, r *http.Request, jwtClaims userAuthentication.Claims) error {
    rows, err := db.Db.Query("SELECT user_id, content, created_at FROM messages WHERE user_id = $1 ORDER BY created_at", jwtClaims.UserId)
    if err != nil {
        http.Error(w, "failed to query messages", http.StatusInternalServerError)
        return err
    }
    messages := make([]db.Message, 0)
    defer rows.Close()

    // Loop over the rows and scan each into a Message struct
    for rows.Next() {
        var msg db.Message
        if err := rows.Scan(&msg.UserID, &msg.Body, &msg.Timestamp); err != nil {
            http.Error(w, "failed to scan message row", http.StatusInternalServerError)
            return err
        }
        msg.Username = jwtClaims.Username
        messages = append(messages, msg)
    }
    if err := rows.Err(); err != nil {
        http.Error(w, "error iterating over rows", http.StatusInternalServerError)
        return err
    }

    // Respond with the JWT
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(MessageResponse{Messages: messages})
    return nil
}