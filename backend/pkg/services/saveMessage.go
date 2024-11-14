package services

import (
	"fmt"

	db "github.com/tash-canter/go-chat-app/backend/pkg/db"
)

func SaveMessage(userId int, message string) error {
	sql := `INSERT INTO messages (user_id, content) VALUES ($1, $2)`
	_, err := db.Db.Exec(sql, userId, message)
	if err != nil {
		return fmt.Errorf("failed to insert message into db: %v", err)
	}
	return nil
}