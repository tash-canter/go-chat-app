package handlers

import (
	"net/http"

	"github.com/tash-canter/go-chat-app/backend/pkg/services"
	"github.com/tash-canter/go-chat-app/backend/pkg/utils"
	"github.com/tash-canter/go-chat-app/backend/pkg/validation"
)

func SearchUsersHandler(w http.ResponseWriter, r *http.Request) {
	_, ok := utils.GetUserFromContext(r.Context())
	if !ok {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "User not found in context")
		return
	}
	
	username := r.URL.Query().Get("username")
	validationResult := validation.ValidateSearchUsersParams(username)
	if !validationResult.IsValid {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid username parameter")
		return
	}
	
	users, err := services.SearchUsers(username)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to search users")
		return
	}
	
	utils.SendSuccessResponse(w, services.UsersResponse{Users: users})
}