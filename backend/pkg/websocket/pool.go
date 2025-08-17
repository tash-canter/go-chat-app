package websocket

import (
	"fmt"
	"sync"

	"github.com/tash-canter/go-chat-app/backend/pkg/services"
)

type Pool struct {
	Register   	chan *Client
	Unregister 	chan *Client
	Clients    	map[uint]*Client
	Groups     	map[uint]map[uint]*Client
	Broadcast  	chan Message
	mu			sync.RWMutex
}

func newPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[uint]*Client),
		Broadcast:  make(chan Message),
	}
}


func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			pool.mu.Lock()
			pool.Clients[client.userID] = client
			pool.mu.Unlock()
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
		case client := <-pool.Unregister:
			pool.mu.Lock()
			delete(pool.Clients, client.userID)
			pool.mu.Unlock()
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
		case message := <-pool.Broadcast:
			fmt.Printf("Routing private message to: %s\n", message.RecipientUsername)
			if err := services.SavePrivateMessage(message.UserID, message.RecipientID, message.Body); err != nil {
				fmt.Println("Error saving message:", err)
				return
			}
			pool.BroadcastToPrivateChat(message)
			
		}
	}
}

func (pool *Pool) BroadcastToPrivateChat(message Message) {
	pool.mu.RLock()
    if recipient, ok := pool.Clients[message.RecipientID]; ok {
		err := recipient.Conn.WriteJSON(message)
		if err != nil {
			fmt.Printf("Error sending private message: %v\n", err)
		}
	} else {
		fmt.Printf("User %s not connected\n", message.RecipientUsername)
	}
	if user, ok := pool.Clients[message.UserID]; ok {
		err := user.Conn.WriteJSON(message)
		if err != nil {
			fmt.Printf("Error sending private message: %v\n", err)
		}
	}
	pool.mu.RUnlock()
}
