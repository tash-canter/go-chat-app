package services

import (
	"fmt"
	"time"

	db "github.com/tash-canter/go-chat-app/backend/pkg/db"
)

func UpdateConversation(chatName string, lastMessage string, lastMessageAt time.Time, lastMessageBy uint, conversationId uint) error {
	sql := `UPDATE conversations
			SET 
				chat_name = COALESCE($1, chat_name),
				last_message = COALESCE($2, last_message),
				last_message_at = COALESCE($3, last_message_at),
				last_message_by = COALESCE($4, last_message_by)
			WHERE id = $5;`
	_, err := db.Db.Exec(sql, chatName, lastMessage, lastMessageAt, lastMessageBy, conversationId)
	if err != nil {
		return fmt.Errorf("failed to insert message into db: %v", err)
	}

	sql_cp := `UPDATE conversation_participants
				SET unread_count = unread_count + 1
				WHERE conversation_id = $1 AND user_id != $2;`
	_, err = db.Db.Exec(sql_cp, conversationId, lastMessageBy)
	if err != nil {
		return fmt.Errorf("failed to insert message into db: %v", err)
	}
	return nil
}