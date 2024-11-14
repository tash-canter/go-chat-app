package db

import "time"

type User struct {
    UserID      uint   `json:"userId"`
    Username 	string `json:"username"`
    Password 	string `json:"password"`
}

type Message struct {
    UserID      uint   		`json:"userId"`
	Username	string		`json:"username"`
    Body 		string 		`json:"body"`
    Timestamp 	time.Time 	`json:"timestamp"`
}