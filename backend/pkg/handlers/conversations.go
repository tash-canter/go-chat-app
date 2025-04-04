package handlers

import (
	"fmt"
	"net/http"

	"github.com/tash-canter/go-chat-app/backend/pkg/middleware"
	"github.com/tash-canter/go-chat-app/backend/pkg/services"
	"github.com/tash-canter/go-chat-app/backend/pkg/userAuthentication"
)

func ConversationsHandler(w http.ResponseWriter, r *http.Request) {
	tokenString := middleware.ExtractTokenFromHeader(r)
	jwtClaims, err := userAuthentication.ValidateJWT(tokenString)
	if err != nil {
		fmt.Println(err)
		return
	}
	if r.Method == http.MethodPost {
		err = services.AddConversation(w, r, *jwtClaims)
		if err != nil {
			fmt.Println(err)
		}
	} else if r.Method == http.MethodGet {
		err = services.HydrateConversations(w, r, *jwtClaims)
		if err != nil {
			fmt.Println(err)
		}
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}