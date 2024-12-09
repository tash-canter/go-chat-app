package services

import (
	"fmt"

	db "github.com/tash-canter/go-chat-app/backend/pkg/db"
)

func SavePrivateMessage(userId uint, recipientId uint, message string) error {
	sql := `INSERT INTO private_messages (user_id, recipient_id, content) VALUES ($1, $2, $3)`
	_, err := db.Db.Exec(sql, userId, recipientId, message)
	if err != nil {
		return fmt.Errorf("failed to insert message into db: %v", err)
	}
	return nil
}