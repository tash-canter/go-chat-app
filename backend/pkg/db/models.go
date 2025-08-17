package db

import "time"

type User struct {
    UserID      uint   `json:"userID"`
    Username 	string `json:"username"`
    Password 	string `json:"password"`
}

type Group struct {
    GroupID         uint   `json:"groupId"`
    GroupName 	    string `json:"groupName"`
    Description 	string `json:"description"`
    CreatedBy       uint   `json:"createdBy"`
}

type PrivateMessage struct {
    UserID      uint   		`json:"userId"`
    RecipientId uint        `json:"recipientId"`
	Username	string		`json:"username"`
    Body 		string 		`json:"body"`
    Timestamp 	time.Time 	`json:"timestamp"`
    IsRead      bool        `json:"isRead"`
}

type GroupMessage struct {
    UserID      uint   		`json:"userId"`
    GroupId     uint        `json:"groupId"`
	Username	string		`json:"username"`
    Body 		string 		`json:"body"`
    Timestamp 	time.Time 	`json:"timestamp"`
    IsRead      bool        `json:"isRead"`
}