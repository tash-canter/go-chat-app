package config

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Database DatabaseConfig
	JWT      JWTConfig
	CORS     CORSConfig
	Server   ServerConfig
	Env      string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

type JWTConfig struct {
	Secret      string
	ExpiryHours int
}

type CORSConfig struct {
	AllowedOrigin  string
	AllowedMethods string
	AllowedHeaders string
}

type ServerConfig struct {
	HTTPPort      string
	WebSocketPort string
}

func LoadConfig() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	return &Config{
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "chatappuser"),
			Password: getEnv("DB_PASSWORD", "tashchatapp"),
			Name:     getEnv("DB_NAME", "chatappdb"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		JWT: JWTConfig{
			Secret:      getEnv("JWT_SECRET", "your_very_secure_jwt_secret_key_here_change_this_in_production"),
			ExpiryHours: getEnvAsInt("JWT_EXPIRY_HOURS", 24),
		},
		CORS: CORSConfig{
			AllowedOrigin:  getEnv("CORS_ALLOWED_ORIGIN", "http://localhost:5173"),
			AllowedMethods: getEnv("CORS_ALLOWED_METHODS", "POST,GET,OPTIONS,PUT,DELETE"),
			AllowedHeaders: getEnv("CORS_ALLOWED_HEADERS", "Content-Type,Authorization"),
		},
		Server: ServerConfig{
			HTTPPort:      getEnv("HTTP_PORT", "8080"),
			WebSocketPort: getEnv("WEBSOCKET_PORT", "8081"),
		},
		Env: getEnv("ENV", "development"),
	}
}

func (c *Config) GetDatabaseConnectionString() string {
	return "postgres://" + c.Database.User + ":" + c.Database.Password + "@" + c.Database.Host + ":" + c.Database.Port + "/" + c.Database.Name + "?sslmode=" + c.Database.SSLMode
}

func (c *Config) GetJWTExpiryTime() time.Duration {
	return time.Duration(c.JWT.ExpiryHours) * time.Hour
}

func (c *Config) IsProduction() bool {
	return c.Env == "production"
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}
