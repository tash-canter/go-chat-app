package middleware

import (
	"net/http"
	"strings"
)

func ExtractTokenFromHeader(r *http.Request) string {
	authHeader := r.Header.Get("Authorization")
	if len(authHeader) > 7 && strings.ToUpper(authHeader[0:7]) == "BEARER " {
	  return authHeader[7:]
	}
	return ""
  }

  func ExtractTokenFromUrl(r *http.Request) string {
	token := r.URL.Query().Get("token")
	if token != "" {
		return token
	}
	return ""
  }
