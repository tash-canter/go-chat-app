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
				if err := services.SaveGroupMessage(message.UserId, message.GroupId, message.Body, message.ConversationId); err != nil {
					fmt.Println("Error saving message:", err)
					return
				}
                fmt.Printf("Broadcasting to group: %s\n", message.GroupName)
                pool.BroadcastToGroup(message)
            } else if message.RecipientUsername != "" {
                fmt.Printf("Routing private message to: %s\n", message.RecipientUsername)
				if err := services.SavePrivateMessage(message.UserId, message.RecipientId, message.Body, message.ConversationId); err != nil {
					fmt.Println("Error saving message:", err)
					return
				}
                pool.BroadcastToPrivateChat(message)
			}
		}
	}
}

func (pool *Pool) AddToGroup(client *Client, groupId uint) {
    if pool.Groups[groupId] == nil {
        pool.Groups[groupId] = make(map[uint]*Client)
    }
    pool.Groups[groupId][client.userId] = client
    fmt.Printf("User %d added to group %d\n", client.userId, groupId)
}

func (pool *Pool) RemoveFromGroup(client *Client, groupId uint) {
    if _, ok := pool.Groups[groupId]; ok {
        delete(pool.Groups[groupId], client.userId)
        fmt.Printf("User %d removed from group %d\n", client.userId, groupId)
        if len(pool.Groups[groupId]) == 0 {
            delete(pool.Groups, groupId)
        }
    }
}

func (pool *Pool) BroadcastToGroup(message Message) {
	pool.mu.RLock()
    if members, ok := pool.Groups[message.GroupId]; ok {
        for _, member := range members {
            if err := member.Conn.WriteJSON(message); err != nil {
                fmt.Printf("Error broadcasting to user %s: %v\n", member.ID, err)
            }
        }
    } else {
		fmt.Printf("Group %s not found\n", message.GroupName)
	}
	services.UpdateConversation(message.GroupName, message.Body, message.Timestamp, message.UserId, message.ConversationId)
	pool.mu.RUnlock()
}

func (pool *Pool) BroadcastToPrivateChat(message Message) {
	pool.mu.RLock()
    if recipient, ok := pool.Clients[message.RecipientId]; ok {
		err := recipient.Conn.WriteJSON(message)
		if err != nil {
			fmt.Printf("Error sending private message: %v\n", err)
		}
	} else {
		fmt.Printf("User %s not connected\n", message.RecipientUsername)
	}
	if user, ok := pool.Clients[message.UserId]; ok {
		err := user.Conn.WriteJSON(message)
		if err != nil {
			fmt.Printf("Error sending private message: %v\n", err)
		}
	}
	services.UpdateConversation(message.GroupName, message.Body, message.Timestamp, message.UserId, message.ConversationId)
	pool.mu.RUnlock()
}
