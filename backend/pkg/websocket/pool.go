package websocket

import (
	"fmt"
	"sync"

	"github.com/tash-canter/go-chat-app/backend/pkg/services"
)

type Pool struct {
	Register   		chan *Client
	Unregister 		chan *Client
	Clients    		map[uint]*Client
	Conversations   map[uint]map[uint]*Client
	Broadcast  		chan Message
	mu				sync.RWMutex
}

func newPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[uint]*Client),
		Broadcast:  make(chan Message),
		Conversations: make(map[uint]map[uint]*Client),
	}
}


func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			pool.mu.Lock()
			pool.Clients[client.userId] = client
			pool.mu.Unlock()
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
		case client := <-pool.Unregister:
			pool.mu.Lock()
			delete(pool.Clients, client.userId)
			pool.mu.Unlock()
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
		case message := <-pool.Broadcast:
			if message.GroupName != "" {
				if err := services.SaveGroupMessage(message.UserId, message.Body, message.ConversationId); err != nil {
					fmt.Println("Error saving message:", err)
					return
				}
            } else if message.RecipientUsername != "" {
                fmt.Printf("Routing private message to: %s\n", message.RecipientUsername)
				if err := services.SavePrivateMessage(message.UserId, message.Body, message.ConversationId); err != nil {
					fmt.Println("Error saving message:", err)
					return
				}
			}
			pool.BroadcastToConversation(message)
		}
	}
}

func (pool *Pool) AddToConversation(client *Client, conversationId uint) {
    if pool.Conversations[conversationId] == nil {
        pool.Conversations[conversationId] = make(map[uint]*Client)
    }
    pool.Conversations[conversationId][client.userId] = client
    fmt.Printf("User %d added to conversation %d\n", client.userId, conversationId)
}

func (pool *Pool) RemoveFromGroup(client *Client, conversationId uint) {
    if _, ok := pool.Conversations[conversationId]; ok {
        delete(pool.Conversations[conversationId], client.userId)
        fmt.Printf("User %d removed from group %d\n", client.userId, conversationId)
        if len(pool.Conversations[conversationId]) == 0 {
            delete(pool.Conversations, conversationId)
        }
    }
}

func (pool *Pool) BroadcastToConversation(message Message) {
	pool.mu.RLock()
    if members, ok := pool.Conversations[message.ConversationId]; ok {
        for _, member := range members {
            if err := member.Conn.WriteJSON(message); err != nil {
                fmt.Printf("Error broadcasting to user %s: %v\n", member.ID, err)
            }
        }
    } else {
		fmt.Printf("Conversation %s not found\n", message.GroupName)
	}
	services.UpdateConversation(message.GroupName, message.Body, message.Timestamp, message.UserId, message.ConversationId)
	pool.mu.RUnlock()
}

