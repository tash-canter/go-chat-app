package websocket

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
	"github.com/tash-canter/go-chat-app/backend/pkg/validation"
)

type Client struct {
	ID   				string
	Conn 				*websocket.Conn
	Pool 				*Pool
	userID				uint
}

type Message struct {
	Type     			int    	`json:"type"`
	Body     			string 	`json:"body"`
	Username 			string 	`json:"username"`
	UserID				uint	`json:"userID"`
	RecipientUsername 	string 	`json:"recipientUsername"`
	RecipientID			uint	`json:"recipientID"`
	Timestamp			string	`json:"timestamp"`
	Action				string	`json:"action"`
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		messageType, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		var newMessage Message

		err = json.Unmarshal([]byte(p), &newMessage)
		if err != nil {
			log.Printf("Error unmarshalling JSON: %v", err)
			continue
		}

		// Validate message content
		contentValidation := validation.ValidateMessageContent(newMessage.Body)
		if !contentValidation.IsValid {
			log.Printf("Message validation failed for user %d: %+v", newMessage.UserID, contentValidation.Errors)
			continue
		}

		// Basic recipient ID check
		if newMessage.RecipientID == 0 {
			log.Printf("Invalid recipient ID (0) from user %d", newMessage.UserID)
			continue
		}

		message := Message{
			Type: messageType, 
			Body: newMessage.Body, 
			Username: newMessage.Username, 
			Timestamp: newMessage.Timestamp, 
			UserID: newMessage.UserID, 
			RecipientID: newMessage.RecipientID,
			RecipientUsername: newMessage.RecipientUsername,
		}
		c.Pool.Broadcast <- message
		log.Printf("Message received from user %d: %s", message.UserID, message.Body)
	}
}
