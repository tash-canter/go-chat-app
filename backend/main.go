package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"log"

	"github.com/golang-jwt/jwt"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"

	"github.com/tash-canter/go-chat-app/backend/handlers"
	"github.com/tash-canter/go-chat-app/backend/pkg/userAuthentication"
	"github.com/tash-canter/go-chat-app/backend/pkg/websocket"
)

func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	// Step 1: Extract the JWT from the query parameter
	tokenString := r.URL.Query().Get("token")
	if tokenString == "" {
		http.Error(w, "Token required", http.StatusUnauthorized)
		return
	}
	// Step 2: Parse and validate the JWT
	claims := &userAuthentication.Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Validate the signing method if desired
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return userAuthentication.JwtKey, nil
	})
	if err != nil || !token.Valid {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	username := claims.Username
	fmt.Printf("User '%s' connected with valid JWT\n", username)

	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+V\n", err)
	}
	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
		Username: username,
	}

	pool.Register <- client
	client.Read()
}

func setupWebsocket(w http.ResponseWriter, r *http.Request) {
	pool := websocket.NewPool()
	go pool.Start()

	serveWs(pool, w, r)
}

func migrateDb() {
	connStr := "postgres://chatappuser:tashchatapp@localhost:5432/chatappdb?sslmode=disable"
	// Open a connection using the "database/sql" package and the pq driver
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Could not connect to the database: %v", err)
	}
	defer db.Close()

	fmt.Println("Connected to PostgreSQL successfully!")

	/// Setup migration driver for postgres
	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		log.Fatalf("Could not create migration driver: %v", err)
	}

	 // Instantiate the migrate instance with the file source and database
	 m, err := migrate.NewWithDatabaseInstance(
	   "file://migrations", // Path to migration files
	   "postgres",          // Database name
	   driver,
   )
   if err != nil {
	   log.Fatalf("Could not create migrate instance: %v", err)
   }

   // Apply all up migrations
   if err := m.Up(); err != nil && err != migrate.ErrNoChange {
	   log.Fatalf("Could not run up migrations: %v", err)
   }

   fmt.Println("Migrations applied successfully!")
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}



func main() {
	fmt.Println("Distributed Chat App v0.01")

	mux := http.NewServeMux()

	migrateDb()
	userAuthentication.InitDb()

	mux.HandleFunc("/api/login", handlers.LoginHandler)
	mux.HandleFunc("/api/register", userAuthentication.RegisterUser)

	go func() {
        log.Println("Starting HTTP server on :8080")
		handler := corsMiddleware(mux)
		err := http.ListenAndServe(":8080", handler)
        if err != nil {
            log.Fatalf("HTTP server error: %v", err)
        }
    }()

	http.HandleFunc("/ws", setupWebsocket)
	log.Println("Starting WebSocket server on :8081")
    err := http.ListenAndServe(":8081", nil)
    if err != nil {
        log.Fatalf("WebSocket server error: %v", err)
    }

	defer userAuthentication.Db.Close()
}
