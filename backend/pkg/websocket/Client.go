package websocket

import (
	"encoding/json"
	"fmt"
	"log"

	// "sync"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID   		string
	Conn 		*websocket.Conn
	Pool 		*Pool
	Username	string
}

type Message struct {
	Type     	int    	`json:"type"`
	Body     	string 	`json:"body"`
	Username 	string 	`json:"username"`
	UserId		int		`json:"userId"`
	Timestamp	string	`json:"timestamp"`
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

		message := Message{Type: messageType, Body: newMessage.Body, Username: newMessage.Username, Timestamp: newMessage.Timestamp, UserId: newMessage.UserId}
		c.Pool.Broadcast <- message
		fmt.Printf("Message Received: %+v\n", message)
	}
}
