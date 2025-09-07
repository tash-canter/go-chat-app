package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilla/mux"
	"github.com/tash-canter/go-chat-app/backend/pkg/config"
	"github.com/tash-canter/go-chat-app/backend/pkg/db"
	"github.com/tash-canter/go-chat-app/backend/pkg/handlers"
	"github.com/tash-canter/go-chat-app/backend/pkg/middleware"
	"github.com/tash-canter/go-chat-app/backend/pkg/utils"
	"github.com/tash-canter/go-chat-app/backend/pkg/websocket"
)

func main() {
	log.Println("Distributed Chat App v0.01")

	cfg := config.LoadConfig()

	utils.InitJWT(cfg.JWT.Secret)

	websocket.InitWebSocket(cfg)

	db.InitDb(cfg)
	defer db.Db.Close()

	router := mux.NewRouter()

	api := router.PathPrefix("/api").Subrouter()
	
	api.HandleFunc("/login", handlers.LoginHandler(cfg)).Methods("POST")
	api.HandleFunc("/register", handlers.RegisterHandler(cfg)).Methods("POST")
	api.HandleFunc("/logout", handlers.LogoutHandler).Methods("POST")
	
	api.HandleFunc("/validateCookie", middleware.AuthMiddleware(handlers.ValidateCookieHandler)).Methods("GET")
	api.HandleFunc("/hydrateMessages", middleware.AuthMiddleware(handlers.HydrateMessagesHandler)).Methods("GET")
	api.HandleFunc("/searchUsers", middleware.AuthMiddleware(handlers.SearchUsersHandler)).Methods("GET")

	router.HandleFunc("/ws", websocket.SetupWebsocket)

	handler := middleware.CorsMiddleware(cfg)(router)

	httpServer := &http.Server{
		Addr:    ":" + cfg.Server.HTTPPort,
		Handler: handler,
	}

	wsServer := &http.Server{
		Addr:    ":" + cfg.Server.WebSocketPort,
		Handler: router,
	}

	go func() {
		log.Printf("Starting HTTP server on :%s", cfg.Server.HTTPPort)
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("HTTP server error: %v", err)
		}
	}()

	go func() {
		log.Printf("Starting WebSocket server on :%s", cfg.Server.WebSocketPort)
		if err := wsServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("WebSocket server error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down servers...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := httpServer.Shutdown(ctx); err != nil {
		log.Printf("HTTP server shutdown error: %v", err)
	} else {
		log.Println("HTTP server shutdown complete")
	}

	if err := wsServer.Shutdown(ctx); err != nil {
		log.Printf("WebSocket server shutdown error: %v", err)
	} else {
		log.Println("WebSocket server shutdown complete")
	}

	websocket.GetPool().Shutdown()

	if err := db.Db.Close(); err != nil {
		log.Printf("Database close error: %v", err)
	} else {
		log.Println("Database connection closed")
	}

	log.Println("Server shutdown complete")
}
