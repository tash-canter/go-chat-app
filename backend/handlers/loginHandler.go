package handlers

import (
	"net/http"

	"github.com/tash-canter/go-chat-app/backend/pkg/userAuthentication"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		userAuthentication.LoginUser(w, r)
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}