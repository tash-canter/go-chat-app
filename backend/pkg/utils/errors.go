package utils

// AuthError is a unified error type for all authentication-related errors
type AuthError struct {
	Message    string
	HTTPStatus int
	ErrorType  string // "login", "registration", "validation", etc.
}

func (e *AuthError) Error() string {
	return e.Message
}

func (e *AuthError) StatusCode() int {
	return e.HTTPStatus
}

// Helper functions to create specific error types
func NewLoginError(message string, statusCode int) *AuthError {
	return &AuthError{
		Message:    message,
		HTTPStatus: statusCode,
		ErrorType:  "login",
	}
}

func NewRegistrationError(message string, statusCode int) *AuthError {
	return &AuthError{
		Message:    message,
		HTTPStatus: statusCode,
		ErrorType:  "registration",
	}
}

func NewValidationError(message string, statusCode int) *AuthError {
	return &AuthError{
		Message:    message,
		HTTPStatus: statusCode,
		ErrorType:  "validation",
	}
}
