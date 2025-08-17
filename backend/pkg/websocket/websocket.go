package websocket

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/tash-canter/go-chat-app/backend/pkg/userAuthentication"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

var pool *Pool

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
        http.Error(w, "unauthorized", http.StatusUnauthorized)
        return
    }
	token := cookie.Value
	jwtClaims, err := userAuthentication.ValidateJWT(token)
	if err != nil {
		fmt.Println(err)
		return
	}

	conn, err := upgrade(w, r)
	if err != nil {
		fmt.Println(err, "Error upgrading")
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