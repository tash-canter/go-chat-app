package handlers

import (
	"fmt"
	"net/http"

	"github.com/tash-canter/go-chat-app/backend/pkg/services"
	"github.com/tash-canter/go-chat-app/backend/pkg/userAuthentication"
)

func SearchUsersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		cookie, err := r.Cookie("auth_token")
		if err != nil {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}
		token := cookie.Value
		_, err = userAuthentication.ValidateJWT(token)
		if err != nil {
			fmt.Println(err)
			return
		}
		err = services.SearchUsers(w, r)
		if err != nil {
			fmt.Println(err)
		}
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}