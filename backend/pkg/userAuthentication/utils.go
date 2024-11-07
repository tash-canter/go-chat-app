package userAuthentication

import (
	"database/sql"
	"log"
)

type User struct {
    ID       uint   `json:"id"`
    Username string `json:"username"`
    Password string `json:"-"`
}

type RegisterResponse struct {
    JWT string `json:"jwt"`
}

var Db *sql.DB

func InitDb () {
	connStr := "postgres://chatappuser:tashchatapp@localhost:5432/chatappdb?sslmode=disable"
	// Open a connection using the "database/sql" package and the pq driver
	var err error
	Db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Could not connect to the database: %v", err)
	}
}