package services

import (
	"database/sql"
	"fmt"

	db "github.com/tash-canter/go-chat-app/backend/pkg/db"
)

func getRecipientID(conversationID uint, userID uint) (uint, error) {
	var recipientID uint

	query := `
		SELECT user_id 
		FROM conversation_participants
		WHERE conversation_id = $1 AND user_id != $2
		LIMIT 1;`

	err := db.Db.QueryRow(query, conversationID, userID).Scan(&recipientID)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, fmt.Errorf("no recipient found for conversation_id %d and user_id %d", conversationID, userID)
		}
		return 0, err
	}

	return recipientID, nil
}

func SavePrivateMessage(userId uint, message string, conversationId uint) error {
	recipientId, err := getRecipientID(conversationId, userId)
	if err != nil {
		return err
	}
	sql := `INSERT INTO private_messages (user_id, recipient_id, content, conversation_id) VALUES ($1, $2, $3, $4)`
	_, err = db.Db.Exec(sql, userId, recipientId, message, conversationId)
	if err != nil {
		return fmt.Errorf("failed to insert message into db: %v", err)
	}
	return nil
}