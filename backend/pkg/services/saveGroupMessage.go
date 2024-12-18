package services

import (
	"fmt"

	db "github.com/tash-canter/go-chat-app/backend/pkg/db"
)

func SaveGroupMessage(userId uint, groupId uint, message string, conversationId uint) error {
	sql := `INSERT INTO group_messages (user_id, group_id, content) VALUES ($1, $2, $3)`
	_, err := db.Db.Exec(sql, userId, groupId, message)
	if err != nil {
		return fmt.Errorf("failed to insert message into db: %v", err)
	}
	return nil
}