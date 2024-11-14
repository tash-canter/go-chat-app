package websocket

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/tash-canter/go-chat-app/backend/pkg/middleware"
	"github.com/tash-canter/go-chat-app/backend/pkg/userAuthentication"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func upgrade(w http.ResponseWriter, r *http.Request) (*websocket.Conn, error) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return nil, err
	}
	return conn, nil
}

func serveWs(pool *Pool, w http.ResponseWriter, r *http.Request) {
	tokenString := middleware.ExtractTokenFromUrl(r)
	jwtClaims, err := userAuthentication.ValidateJWT(tokenString)
	if err != nil {
		fmt.Println(err)
	}

	conn, err := upgrade(w, r)
	if err != nil {
		fmt.Println(err)
	}
	client := &Client{
		Conn: conn,
		Pool: pool,
		Username: jwtClaims.Username,
	}

	pool.Register <- client
	client.Read()
}

func SetupWebsocket(w http.ResponseWriter, r *http.Request) {
	pool := newPool()
	go pool.Start()

	serveWs(pool, w, r)
}