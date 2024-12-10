package services

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tash-canter/go-chat-app/backend/pkg/db"
	"github.com/tash-canter/go-chat-app/backend/pkg/userAuthentication"
)

type PriavteMessageResponse struct {
    Messages []db.PrivateMessage `json:"privateMessages"`
}

// Register new user
func HydratePrivateMessages(w http.ResponseWriter, r *http.Request, jwtClaims userAuthentication.Claims) error {
    senderID := jwtClaims.UserId
    recipientID := r.URL.Query().Get("recipient_id")

    if recipientID == "" {
        http.Error(w, "recipient_id query parameters are required", http.StatusBadRequest)
        return fmt.Errorf("missing required query parameters")
    }
    rows, err := db.Db.Query(`
        SELECT user_id, recipient_id, username, content, private_messages.created_at
        FROM private_messages
        JOIN users ON private_messages.user_id = users.id
        WHERE 
            (user_id = $1 AND recipient_id = $2) OR
            (user_id = $2 AND recipient_id = $1)
        ORDER BY created_at`, senderID, recipientID)
    if err != nil {
        http.Error(w, "failed to query messages", http.StatusInternalServerError)
        return err
    }
    defer rows.Close()

    messages := make([]db.PrivateMessage, 0)

    // Loop over the rows and scan each into a Message struct
    for rows.Next() {
        var msg db.PrivateMessage
        if err := rows.Scan(&msg.UserID, &msg.RecipientId, &msg.Username, &msg.Body, &msg.Timestamp); err != nil {
            http.Error(w, "failed to scan message row", http.StatusInternalServerError)
            return err
        }
        messages = append(messages, msg)
    }
    if err := rows.Err(); err != nil {
        http.Error(w, "error iterating over rows", http.StatusInternalServerError)
        return err
    }

    // Respond with the JWT
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(PriavteMessageResponse{Messages: messages})
    return nil
}