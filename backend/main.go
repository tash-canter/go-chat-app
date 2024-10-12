package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"

	"github.com/tash-canter/go-chat-app/backend/pkg/userAuthentication"
	"github.com/tash-canter/go-chat-app/backend/pkg/websocket"
)

func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+V\n", err)
	}
	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
}

func setupRoutes() {
	pool := websocket.NewPool()
	go pool.Start()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pool, w, r)
	})
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

func main() {
	fmt.Println("Distributed Chat App v0.01")

	migrateDb()
	setupRoutes()
	http.HandleFunc("/api/login", userAuthentication.LoginUser)
	http.HandleFunc("/api/register", userAuthentication.RegisterUser)
	http.ListenAndServe(":8080", nil)
}
