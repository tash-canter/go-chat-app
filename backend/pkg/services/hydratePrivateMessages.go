package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/tash-canter/go-chat-app/backend/pkg/db"
)


type privateMessage struct {
    UserId      uint   		`json:"userId"`
    RecipientId uint        `json:"recipientId"`
	Username	string		`json:"username"`
    Body 		string 		`json:"body"`
    Timestamp 	time.Time 	`json:"timestamp"`
}

type PrivateMessageResponse struct {
    Messages []privateMessage `json:"privateMessages"`
}

func HydratePrivateMessages(w http.ResponseWriter, r *http.Request) error {
    conversationId := r.URL.Query().Get("conversation_id")

    if conversationId == "" {
        http.Error(w, "conversation_id query parameters are required", http.StatusBadRequest)
        return fmt.Errorf("missing required query parameters")
    }
    rows, err := db.Db.Query(`
        SELECT user_id, recipient_id, username, content, private_messages.created_at
        FROM private_messages
        JOIN users ON private_messages.user_id = users.id
        WHERE 
            conversation_id = $1
        ORDER BY created_at`, conversationId)
    if err != nil {
        http.Error(w, "failed to query messages", http.StatusInternalServerError)
        return err
    }
    defer rows.Close()

    messages := make([]privateMessage, 0)

    for rows.Next() {
        var msg privateMessage
        if err := rows.Scan(&msg.UserId, &msg.RecipientId, &msg.Username, &msg.Body, &msg.Timestamp); err != nil {
            http.Error(w, "failed to scan message row", http.StatusInternalServerError)
            return err
        }
        messages = append(messages, msg)
    }
    if err := rows.Err(); err != nil {
        http.Error(w, "error iterating over rows", http.StatusInternalServerError)
        return err
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(PrivateMessageResponse{Messages: messages})
    return nil
}