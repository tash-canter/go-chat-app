package main

import (
	"fmt"
	"net/http"

	"log"

	"github.com/tash-canter/go-chat-app/backend/pkg/db"
	"github.com/tash-canter/go-chat-app/backend/pkg/handlers"
	"github.com/tash-canter/go-chat-app/backend/pkg/middleware"
	"github.com/tash-canter/go-chat-app/backend/pkg/websocket"
)

func main() {
	fmt.Println("Distributed Chat App v0.01")

	mux := http.NewServeMux()

	db.MigrateDb()
	db.InitDb()

	mux.HandleFunc("/api/login", handlers.LoginHandler)
	mux.HandleFunc("/api/register", handlers.RegisterHandler)
	mux.HandleFunc("/api/hydrateMessages", handlers.HydrateMessagesHandler)

	go func() {
        log.Println("Starting HTTP server on :8080")
		handler := middleware.CorsMiddleware(mux)
		err := http.ListenAndServe(":8080", handler)
        if err != nil {
            log.Fatalf("HTTP server error: %v", err)
        }
    }()

	http.HandleFunc("/ws", websocket.SetupWebsocket)
	log.Println("Starting WebSocket server on :8081")
    err := http.ListenAndServe(":8081", nil)
    if err != nil {
        log.Fatalf("WebSocket server error: %v", err)
    }

	defer db.Db.Close()
}
