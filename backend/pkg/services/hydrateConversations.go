package services

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/tash-canter/go-chat-app/backend/pkg/db"
	"github.com/tash-canter/go-chat-app/backend/pkg/userAuthentication"
)

type Conversation struct {
    conversationId      uint
    lastMessage         string
    lastMessageAt       time.Time
    isGroup             bool
    unreadCount         uint
    displayName         string
}
type ConversationsResponse struct {
    Conversations []Conversation `json:"conversations"`
}

func HydrateConversations(w http.ResponseWriter, r *http.Request, jwtClaims userAuthentication.Claims) error {
    userID := jwtClaims.UserId

    rows, err := db.Db.Query(`
        SELECT
            c.id AS conversation_id,
            c.last_message,
            c.last_message_at,
            c.is_group,
            cp.unread_count,
            CASE WHEN c.chat_name IS NOT NULL THEN
                c.chat_name
            ELSE
                u.username
            END AS display_name
        FROM
            conversations c
            JOIN conversation_participants cp ON c.id = cp.conversation_id
            LEFT JOIN conversation_participants other_cp ON c.id = other_cp.conversation_id
                AND other_cp.user_id != cp.user_id
            LEFT JOIN users u ON other_cp.user_id = u.id
        WHERE
            cp.user_id = $1
        ORDER BY
            c.last_message_at DESC
        LIMIT 10;`, userID)
    if err != nil {
        http.Error(w, "failed to query conversations", http.StatusInternalServerError)
        return err
    }
    defer rows.Close()

    conversations := make([]Conversation, 0)

    // Loop over the rows and scan each into a Message struct
    for rows.Next() {
        var conversation Conversation
        if err := rows.Scan(&conversation.conversationId, &conversation.lastMessage, &conversation.lastMessageAt, &conversation.isGroup, &conversation.unreadCount, &conversation.displayName); err != nil {
            http.Error(w, "failed to scan message row", http.StatusInternalServerError)
            return err
        }
        conversations = append(conversations, conversation)
    }
    if err := rows.Err(); err != nil {
        http.Error(w, "error iterating over rows", http.StatusInternalServerError)
        return err
    }

    // Respond with the JWT
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(ConversationsResponse{Conversations: conversations})
    return nil
}