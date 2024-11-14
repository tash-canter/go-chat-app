package db

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
)

func MigrateDb() {
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