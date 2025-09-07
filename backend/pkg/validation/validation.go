package validation

import (
	"net/http"
	"regexp"
	"strings"

	"github.com/tash-canter/go-chat-app/backend/pkg/utils"
)

// ValidationError represents a validation error
type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
	Value   string `json:"value"`
}

// ValidationResult contains validation results
type ValidationResult struct {
	IsValid bool              `json:"isValid"`
	Errors  []ValidationError `json:"errors,omitempty"`
}

// Common validation patterns
var (
	// Username pattern: 3-20 characters, alphanumeric and underscores only
	usernamePattern = regexp.MustCompile(`^[a-zA-Z0-9_]{3,20}$`)
)

// ValidateUsername validates a username parameter
func ValidateUsername(username string) ValidationResult {
	var errors []ValidationError
	
	if username == "" {
		errors = append(errors, ValidationError{
			Field:   "username",
			Message: "Username is required",
			Value:   username,
		})
		return ValidationResult{IsValid: false, Errors: errors}
	}
	
	// Check length
	if len(username) < 3 {
		errors = append(errors, ValidationError{
			Field:   "username",
			Message: "Username must be at least 3 characters long",
			Value:   username,
		})
	}
	
	if len(username) > 20 {
		errors = append(errors, ValidationError{
			Field:   "username",
			Message: "Username must be no more than 20 characters long",
			Value:   username,
		})
	}
	
	// Check pattern
	if !usernamePattern.MatchString(username) {
		errors = append(errors, ValidationError{
			Field:   "username",
			Message: "Username can only contain letters, numbers, and underscores",
			Value:   username,
		})
	}
	
	return ValidationResult{
		IsValid: len(errors) == 0,
		Errors:  errors,
	}
}


// ValidateMessageContent validates message content
func ValidateMessageContent(content string) ValidationResult {
	var errors []ValidationError
	
	if content == "" {
		errors = append(errors, ValidationError{
			Field:   "content",
			Message: "Message content is required",
			Value:   content,
		})
		return ValidationResult{IsValid: false, Errors: errors}
	}
	
	// Trim whitespace
	content = strings.TrimSpace(content)
	
	// Check length
	if len(content) < 1 {
		errors = append(errors, ValidationError{
			Field:   "content",
			Message: "Message content cannot be empty",
			Value:   content,
		})
	}
	
	if len(content) > 1000 {
		errors = append(errors, ValidationError{
			Field:   "content",
			Message: "Message content must be no more than 1000 characters",
			Value:   content,
		})
	}
	
	// Check for potentially malicious content (basic check)
	if strings.Contains(strings.ToLower(content), "<script") {
		errors = append(errors, ValidationError{
			Field:   "content",
			Message: "Message content contains invalid characters",
			Value:   content,
		})
	}
	
	return ValidationResult{
		IsValid: len(errors) == 0,
		Errors:  errors,
	}
}

// SendValidationErrorResponse sends a validation error response
func SendValidationErrorResponse(w http.ResponseWriter, result ValidationResult) {
	utils.SendErrorResponse(w, http.StatusBadRequest, "Validation failed")
}

// ValidateSearchUsersParams validates parameters for user search
func ValidateSearchUsersParams(username string) ValidationResult {
	return ValidateUsername(username)
}

// ValidateHydrateMessagesParams validates parameters for message hydration
func ValidateHydrateMessagesParams(recipientID string) ValidationResult {
	var errors []ValidationError
	
	if recipientID == "" {
		errors = append(errors, ValidationError{
			Field:   "recipient_id",
			Message: "recipient_id is required",
			Value:   recipientID,
		})
		return ValidationResult{IsValid: false, Errors: errors}
	}
	
	// Basic check: ensure it's not empty and not too long
	if len(recipientID) > 10 {
		errors = append(errors, ValidationError{
			Field:   "recipient_id",
			Message: "recipient_id is too long",
			Value:   recipientID,
		})
	}
	
	return ValidationResult{
		IsValid: len(errors) == 0,
		Errors:  errors,
	}
}
