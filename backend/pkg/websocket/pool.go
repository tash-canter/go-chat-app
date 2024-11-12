package websocket

import (
	"fmt"

	"github.com/tash-canter/go-chat-app/backend/pkg/userAuthentication"
)

type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
}

func NewPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
	}
}

func saveMessage(userId int, message string) error {
	// Insert message into the database
	println("Saving message id", userId)
	sql := `INSERT INTO messages (user_id, content) VALUES ($1, $2)`
	_, err := userAuthentication.Db.Exec(sql, userId, message)
	if err != nil {
		return fmt.Errorf("failed to insert message into db: %v", err)
	}
	return nil
}


func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			pool.Clients[client] = true
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client := range pool.Clients {
				fmt.Println(client)
				client.Conn.WriteJSON(Message{Type: 1, Body: "User Joined the chat...", Username: client.Username})
			}
		case client := <-pool.Unregister:
			delete(pool.Clients, client)
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client := range pool.Clients {
				client.Conn.WriteJSON(Message{Type: 1, Body: "User Disconnected...", Username: client.Username})
			}
		case message := <-pool.Broadcast:
			fmt.Println("Sending message to all clients in Pool")
			for client := range pool.Clients {
				if err := client.Conn.WriteJSON(message); err != nil {
					fmt.Println(err)
					return
				}
				
				if err := saveMessage(message.UserId, message.Body); err != nil {
					fmt.Println("Error saving message:", err)
					return
				}
			}
		}
	}
}
