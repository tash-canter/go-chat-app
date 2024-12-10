package services

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/tash-canter/go-chat-app/backend/pkg/db"
	"github.com/tash-canter/go-chat-app/backend/pkg/userAuthentication"
)

type GroupMessageResponse struct {
    Messages []db.GroupMessage `json:"groupMessages"`
}

// Register new user
func HydrateGroupMessages(w http.ResponseWriter, r *http.Request, jwtClaims userAuthentication.Claims) error {
    groupID := r.URL.Query().Get("group_id")

    if groupID == "" {
        http.Error(w, "group_id query parameters are required", http.StatusBadRequest)
        return fmt.Errorf("missing required query parameters")
    }
    rows, err := db.Db.Query(`
        SELECT user_id, group_id, username, content, created_at
        FROM group_messages 
        JOIN users ON group_messages.user_id = users.id
        WHERE 
            group_id = $1
        ORDER BY created_at`, groupID)
    if err != nil {
        http.Error(w, "failed to query messages", http.StatusInternalServerError)
        return err
    }
    defer rows.Close()

    messages := make([]db.GroupMessage, 0)

    // Loop over the rows and scan each into a Message struct
    for rows.Next() {
        var msg db.GroupMessage
        if err := rows.Scan(&msg.UserID, &msg.GroupId, &msg.Username, &msg.Body, &msg.Timestamp); err != nil {
            http.Error(w, "failed to scan message row", http.StatusInternalServerError)
            return err
        }
        messages = append(messages, msg)
    }
    if err := rows.Err(); err != nil {
        http.Error(w, "error iterating over rows", http.StatusInternalServerError)
        return err
    }

    // Respond with the JWT
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(GroupMessageResponse{Messages: messages})
    return nil
}