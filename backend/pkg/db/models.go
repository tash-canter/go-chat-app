package db

type User struct {
    UserID      uint   `json:"userId"`
    Username 	string `json:"username"`
    Password 	string `json:"password"`
}

type Group struct {
    GroupID         uint   `json:"groupId"`
    GroupName 	    string `json:"groupName"`
    Description 	string `json:"description"`
    CreatedBy       uint   `json:"createdBy"`
}