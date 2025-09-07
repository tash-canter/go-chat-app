package utils

import (
	"encoding/json"
	"net/http"
)

// SetAuthCookie sets the authentication cookie with the given token
func SetAuthCookie(w http.ResponseWriter, token string) {
	cookie := &http.Cookie{
		Name:     "auth_token",
		Value:    token,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
		MaxAge:   60 * 60 * 24 * 7, // 1 week
	}
	http.SetCookie(w, cookie)
}

// SendJSONResponse sends a JSON response with the given status code and data
func SendJSONResponse(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

// SendErrorResponse sends a JSON error response
func SendErrorResponse(w http.ResponseWriter, statusCode int, message string) {
	SendJSONResponse(w, statusCode, map[string]string{
		"error": message,
	})
}

// SendSuccessResponse sends a JSON success response
func SendSuccessResponse(w http.ResponseWriter, data interface{}) {
	SendJSONResponse(w, http.StatusOK, data)
}
