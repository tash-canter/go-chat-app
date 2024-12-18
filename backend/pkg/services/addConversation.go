package services

import (
	"encoding/json"
	"fmt"
	"net/http"

	db "github.com/tash-canter/go-chat-app/backend/pkg/db"
	"github.com/tash-canter/go-chat-app/backend/pkg/userAuthentication"
)

type conversation struct {
    RecipientIds       []uint `json:"recipientIds"`
    IsGroup            bool   `json:"isGroup"`
    GroupId            uint   `json:"groupId"`
    ChatName           string `json:"chatName"`
}


func AddConversation(w http.ResponseWriter, r *http.Request, jwtClaims userAuthentication.Claims) error {
	var conversation conversation
    err := json.NewDecoder(r.Body).Decode(&conversation)
    if err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return err
    }
	
	sql_add_conversation := 
	`INSERT INTO conversations (is_group, group_id, chat_name, last_message, last_message_at, last_message_by) VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id;`

	var conversationId uint
	err = db.Db.QueryRow(sql_add_conversation, conversation.IsGroup, conversation.GroupId, conversation.ChatName).Scan(&conversationId)
	if err != nil {
		return fmt.Errorf("failed to insert message into db: %v", err)
	}

	sql_add_conversation_participant := `INSERT INTO conversation_participants (conversation_id, user_id, unread_count) VALUES ($1, $2, $3)`
		_, err = db.Db.Exec(sql_add_conversation_participant, conversationId, jwtClaims.Id, 0)
		if err != nil {
			return fmt.Errorf("failed to insert message into db: %v", err)
		}

	for _, id := range conversation.RecipientIds {
		_, err = db.Db.Exec(sql_add_conversation_participant, conversationId, id, 1)
		if err != nil {
			return fmt.Errorf("failed to insert message into db: %v", err)
		}
	}

	w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]uint{"conversationId": conversationId})
	return nil
}