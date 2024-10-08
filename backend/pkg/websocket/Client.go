package websocket

import (
	"encoding/json"
	"fmt"
	"log"

	// "sync"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
}

type Message struct {
	Type     int    `json:"type"`
	Body     string `json:"body"`
	Username string
}

type LabelledMessage struct {
	Username string `json:"username"`
	Body     string `json:"body"`
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

		var labelledMessage LabelledMessage

		err = json.Unmarshal([]byte(p), &labelledMessage)
		if err != nil {
			log.Fatalf("Error unmarshalling JSON: %v", err)
		}

		message := Message{Type: messageType, Body: labelledMessage.Body, Username: labelledMessage.Username}
		c.Pool.Broadcast <- message
		fmt.Printf("Message Received: %+v\n", message)
	}
}
