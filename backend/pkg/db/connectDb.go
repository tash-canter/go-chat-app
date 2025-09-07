package db

import (
	"database/sql"
	"log"
	"time"

	_ "github.com/lib/pq" // PostgreSQL driver
	"github.com/tash-canter/go-chat-app/backend/pkg/config"
)

var Db *sql.DB

func InitDb(cfg *config.Config) {
	connStr := cfg.GetDatabaseConnectionString()
	var err error
	Db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Could not connect to the database: %v", err)
	}
	
	Db.SetMaxOpenConns(25)
	Db.SetMaxIdleConns(5)
	Db.SetConnMaxLifetime(5 * time.Minute)
	
	if err = Db.Ping(); err != nil {
		log.Fatalf("Could not ping the database: %v", err)
	}
	
	log.Println("Database connection established successfully")
}