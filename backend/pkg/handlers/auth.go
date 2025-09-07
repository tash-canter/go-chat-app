package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/tash-canter/go-chat-app/backend/pkg/config"
	"github.com/tash-canter/go-chat-app/backend/pkg/services"
	"github.com/tash-canter/go-chat-app/backend/pkg/utils"
	"github.com/tash-canter/go-chat-app/backend/pkg/validation"
)

func LoginHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var loginRequest struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		
		err := json.NewDecoder(r.Body).Decode(&loginRequest)
		if err != nil {
			utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid request")
			return
		}
		
		usernameValidation := validation.ValidateUsername(loginRequest.Username)
		if !usernameValidation.IsValid {
			utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid username format")
			return
		}

		if len(loginRequest.Password) < 1 {
			utils.SendErrorResponse(w, http.StatusBadRequest, "Password is required")
			return
		}
		
		if len(loginRequest.Password) > 128 {
			utils.SendErrorResponse(w, http.StatusBadRequest, "Password is too long")
			return
		}
		
		result, err := services.LoginUser(loginRequest.Username, loginRequest.Password, cfg.GetJWTExpiryTime())
		if err != nil {
			if authErr, ok := err.(*utils.AuthError); ok {
				utils.SendErrorResponse(w, authErr.StatusCode(), authErr.Error())
				return
			}
			utils.SendErrorResponse(w, http.StatusInternalServerError, "Internal server error")
			return
		}

		utils.SetAuthCookie(w, result.Token)

		utils.SendSuccessResponse(w, map[string]interface{}{
			"success":  true,
			"username": result.Username,
			"userID":   result.UserID,
		})
	}
}

func RegisterHandler(cfg *config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var registerRequest struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		
		err := json.NewDecoder(r.Body).Decode(&registerRequest)
		if err != nil {
			utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid request")
			return
		}
		
		usernameValidation := validation.ValidateUsername(registerRequest.Username)
		if !usernameValidation.IsValid {
			utils.SendErrorResponse(w, http.StatusBadRequest, "Invalid username format")
			return
		}

		if len(registerRequest.Password) < 6 {
			utils.SendErrorResponse(w, http.StatusBadRequest, "Password must be at least 6 characters long")
			return
		}
		
		if len(registerRequest.Password) > 128 {
			utils.SendErrorResponse(w, http.StatusBadRequest, "Password must be no more than 128 characters long")
			return
		}
		
		result, err := services.RegisterUser(registerRequest.Username, registerRequest.Password, cfg.GetJWTExpiryTime())
		if err != nil {
			if authErr, ok := err.(*utils.AuthError); ok {
				utils.SendErrorResponse(w, authErr.StatusCode(), authErr.Error())
				return
			}
			utils.SendErrorResponse(w, http.StatusInternalServerError, "Registration failed")
			return
		}

		utils.SetAuthCookie(w, result.Token)

		utils.SendSuccessResponse(w, map[string]interface{}{
			"success":  true,
			"username": result.Username,
			"userID":   result.UserID,
		})
	}
}

func ValidateCookieHandler(w http.ResponseWriter, r *http.Request) {
	claims, ok := utils.GetUserFromContext(r.Context())
	if !ok {
		utils.SendErrorResponse(w, http.StatusUnauthorized, "User not found in context")
		return
	}

	utils.SendSuccessResponse(w, map[string]interface{}{
		"username": claims.Username,
		"userID":   claims.UserID,
	})
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	cookie := &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
		MaxAge:   -1,
	}
	http.SetCookie(w, cookie)

	utils.SendSuccessResponse(w, map[string]string{"message": "Logged out successfully"})
}