package websocket

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID   				string
	Conn 				*websocket.Conn
	Pool 				*Pool
	userId				uint
}

type Message struct {
	Type     			int    		`json:"type"`
	Body     			string 		`json:"body"`
	ConversationId		uint		`json:"conversationId"`
	Username 			string 		`json:"username"`
	UserId				uint		`json:"userId"`
	RecipientUsername 	string 		`json:"recipientUsername"`
	GroupName   		string 		`json:"groupName"`
	Timestamp			time.Time	`json:"timestamp"`
	Action				string		`json:"action"`
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
			log.Fatalf("Error unmarshalling JSON: %v", err)
		}

		if newMessage.Action == "subscribe" {
			c.Pool.AddToConversation(c, newMessage.ConversationId)
		} else {
			message := Message{
				Type: messageType, 
				Body: newMessage.Body, 
				Username: newMessage.Username, 
				Timestamp: newMessage.Timestamp, 
				UserId: newMessage.UserId, 
				RecipientUsername: newMessage.RecipientUsername,
				GroupName: newMessage.GroupName,
				ConversationId: newMessage.ConversationId,
			}
			c.Pool.Broadcast <- message
			fmt.Printf("Message Received: %+v\n", message)
		}
	}
}
