package models

import "time"

type User struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	Posts     []Post    `gorm:"foreignKey:UserID"`
	CreatedAt time.Time `json:"createdAt"`
}
