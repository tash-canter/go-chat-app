package handlers

import (
	"net/http"

	"github.com/tash-canter/go-chat-app/backend/pkg/services"
	"github.com/tash-canter/go-chat-app/backend/pkg/utils"
	"github.com/tash-canter/go-chat-app/backend/pkg/validation"
)

func HydrateMessagesHandler(w http.ResponseWriter, r *http.Request) {
	claims, ok := utils.GetUserFromContext(r.Context())
	if !ok {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "User not found in context")
		return
	}
	
	recipientID := r.URL.Query().Get("recipient_id")
	validationResult := validation.ValidateHydrateMessagesParams(recipientID)
	if !validationResult.IsValid {
		utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid recipient_id parameter")
		return
	}
	
	messages, err := services.HydrateMessages(claims.UserID, recipientID)
	if err != nil {
		utils.SendErrorResponse(w, http.StatusInternalServerError, "Failed to load messages")
		return
	}
	
	utils.SendSuccessResponse(w, services.MessageResponse{Messages: messages})
}