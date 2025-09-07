package middleware

import (
	"net/http"

	"github.com/tash-canter/go-chat-app/backend/pkg/utils"
)

func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("auth_token")
		if err != nil {
			utils.SendErrorResponse(w, http.StatusUnauthorized, "No auth cookie found")
			return
		}

		claims, err := utils.ValidateJWT(cookie.Value)
		if err != nil {
			utils.SendErrorResponse(w, http.StatusUnauthorized, "Invalid or expired token")
			return
		}

		ctx := utils.SetUserContext(r.Context(), claims)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	}
}

