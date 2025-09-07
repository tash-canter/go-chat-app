package websocket

import (
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/tash-canter/go-chat-app/backend/pkg/config"
	"github.com/tash-canter/go-chat-app/backend/pkg/utils"
)

var upgrader websocket.Upgrader
var pool *Pool

func InitWebSocket(cfg *config.Config) {
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		EnableCompression: true,
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header.Get("Origin")
			if origin == "" {
				log.Printf("WebSocket connection from request without Origin header")
				return true
			}
			
			allowedOrigin := cfg.CORS.AllowedOrigin
			if allowedOrigin == "*" {
				log.Printf("WebSocket connection from origin: %s (development mode)", origin)
				return true
			}
			
			isValid := strings.EqualFold(origin, allowedOrigin)
			if !isValid {
				log.Printf("WebSocket connection rejected from unauthorized origin: %s (expected: %s)", origin, allowedOrigin)
			} else {
				log.Printf("WebSocket connection accepted from origin: %s", origin)
			}
			return isValid
		},
	}
}

func init() {
	pool = newPool()
	go pool.Start()
}

func upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return nil, err
	}
	return conn, nil
}

func serveWs(pool *Pool, w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("auth_token")
    if err != nil {
        log.Printf("WebSocket connection failed: no auth cookie")
        http.Error(w, "unauthorized", http.StatusUnauthorized)
        return
    }
	token := cookie.Value
	jwtClaims, err := utils.ValidateJWT(token)
	if err != nil {
		log.Printf("WebSocket connection failed: invalid JWT - %v", err)
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	conn, err := upgrade(w, r)
	if err != nil {
		log.Printf("WebSocket upgrade failed: %v", err)
		http.Error(w, "WebSocket upgrade failed", http.StatusInternalServerError)
		return
	}

	client := &Client{
		Conn: conn,
		Pool: pool,
		userID: jwtClaims.UserID, 
	}

	pool.Register <- client
	client.Read()
}

func SetupWebsocket(w http.ResponseWriter, r *http.Request) {
	serveWs(pool, w, r)
}

// GetPool returns the global WebSocket pool instance
func GetPool() *Pool {
	return pool
}