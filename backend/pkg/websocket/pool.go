package websocket

import (
	"log"
	"sync"

	"github.com/tash-canter/go-chat-app/backend/pkg/services"
)

type Pool struct {
	Register   	chan *Client
	Unregister 	chan *Client
	Clients    	map[uint]*Client
	Groups     	map[uint]map[uint]*Client
	Broadcast  	chan Message
	shutdown   	chan bool
	mu			sync.RWMutex
}

func newPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[uint]*Client),
		Broadcast:  make(chan Message),
		shutdown:   make(chan bool),
	}
}


func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			pool.mu.Lock()
			pool.Clients[client.userID] = client
			pool.mu.Unlock()
			log.Printf("WebSocket client registered. Pool size: %d", len(pool.Clients))
		case client := <-pool.Unregister:
			pool.mu.Lock()
			delete(pool.Clients, client.userID)
			pool.mu.Unlock()
			log.Printf("WebSocket client unregistered. Pool size: %d", len(pool.Clients))
		case message := <-pool.Broadcast:
			log.Printf("Routing message from %s to %s", message.Username, message.RecipientUsername)
			if err := services.SaveMessage(message.UserID, message.RecipientID, message.Body); err != nil {
				log.Printf("Error saving message: %v", err)
				return
			}
			pool.BroadcastToChat(message)
		case <-pool.shutdown:
			log.Println("WebSocket pool shutting down...")
			pool.shutdownAllClients()
			log.Println("WebSocket pool shutdown complete")
			return
		}
	}
}

func (pool *Pool) BroadcastToChat(message Message) {
	pool.mu.RLock()
    if recipient, ok := pool.Clients[message.RecipientID]; ok {
		err := recipient.Conn.WriteJSON(message)
		if err != nil {
			log.Printf("Error sending message to recipient: %v", err)
		}
	} else {
		log.Printf("User %s not connected - message will be delivered when they come online", message.RecipientUsername)
	}
	if user, ok := pool.Clients[message.UserID]; ok {
		err := user.Conn.WriteJSON(message)
		if err != nil {
			log.Printf("Error sending message to sender: %v", err)
		}
	}
	pool.mu.RUnlock()
}

// Shutdown gracefully shuts down the WebSocket pool
func (pool *Pool) Shutdown() {
	pool.shutdown <- true
}

// shutdownAllClients closes all active WebSocket connections
func (pool *Pool) shutdownAllClients() {
	pool.mu.Lock()
	defer pool.mu.Unlock()
	
	for userID, client := range pool.Clients {
		log.Printf("Closing WebSocket connection for user %d", userID)
		client.Conn.Close()
	}
	
	// Clear the clients map
	pool.Clients = make(map[uint]*Client)
	log.Printf("All WebSocket connections closed")
}
