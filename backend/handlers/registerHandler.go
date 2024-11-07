package handlers

import (
	"net/http"

	"github.com/tash-canter/go-chat-app/backend/pkg/userAuthentication"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		userAuthentication.RegisterUser(w, r)
		w.Write([]byte("Login successful"))
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}