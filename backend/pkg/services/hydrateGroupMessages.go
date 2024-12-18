package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/tash-canter/go-chat-app/backend/pkg/db"
)

type groupMessage struct {
    UserId              uint   		`json:"userId"`
	Username	        string		`json:"username"`
    Body 		        string 		`json:"body"`
    Timestamp 	        time.Time 	`json:"timestamp"`
}

type GroupMessageResponse struct {
    Messages []groupMessage `json:"groupMessages"`
}

func HydrateGroupMessages(w http.ResponseWriter, r *http.Request) error {
    conversationId := r.URL.Query().Get("conversation_id")

    if conversationId == "" {
        http.Error(w, "conversation_id query parameters are required", http.StatusBadRequest)
        return fmt.Errorf("missing required query parameters")
    }
    rows, err := db.Db.Query(`
        SELECT user_id, username, content, created_at
        FROM group_messages 
        JOIN users ON group_messages.user_id = users.id
        WHERE 
            conversation_id = $1
        ORDER BY created_at`, conversationId)
    if err != nil {
        http.Error(w, "failed to query messages", http.StatusInternalServerError)
        return err
    }
    defer rows.Close()

    messages := make([]groupMessage, 0)

    for rows.Next() {
        var msg groupMessage
        if err := rows.Scan(&msg.UserId, &msg.Username, &msg.Body, &msg.Timestamp); err != nil {
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
    json.NewEncoder(w).Encode(GroupMessageResponse{Messages: messages})
    return nil
}