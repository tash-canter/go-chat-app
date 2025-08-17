package websocket

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gorilla/websocket"
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
			log.Fatalf("Error unmarshalling JSON: %v", err)
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
		fmt.Printf("Message Received: %+v\n", message)
	}
}
