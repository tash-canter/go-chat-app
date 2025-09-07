package services

import (
	"log"
	"strconv"

	"github.com/tash-canter/go-chat-app/backend/pkg/db"
)

type MessageResponse struct {
    Messages []db.Message `json:"messages"`
}

func HydrateMessages(senderID uint, recipientIDStr string) ([]db.Message, error) {
    recipientID, err := strconv.ParseUint(recipientIDStr, 10, 32)
    if err != nil {
        log.Printf("Invalid recipient ID: %v", err)
        return nil, err
    }

    rows, err := db.Db.Query(`
        SELECT user_id, recipient_id, username, content, messages.created_at
        FROM messages
        JOIN users ON messages.user_id = users.id
        WHERE 
            (user_id = $1 AND recipient_id = $2) OR
            (user_id = $2 AND recipient_id = $1)
        ORDER BY created_at`, senderID, uint(recipientID))
    if err != nil {
        log.Printf("Database query error: %v", err)
        return nil, err
    }
    defer rows.Close()

    messages := make([]db.Message, 0)

    for rows.Next() {
        var msg db.Message
        if err := rows.Scan(&msg.UserID, &msg.RecipientId, &msg.Username, &msg.Body, &msg.Timestamp); err != nil {
            log.Printf("Row scan error: %v", err)
            return nil, err
        }
        messages = append(messages, msg)
    }
    if err := rows.Err(); err != nil {
        log.Printf("Row iteration error: %v", err)
        return nil, err
    }

    return messages, nil
}