package models

import "time"

type Post struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Content     string    `json:"content"`
	UserID      uint      `json:"userId"`                        // Foreign key
	User        User      `gorm:"foreignKey:UserID" json:"user"` // Relationship
	CreatedAt   time.Time `json:"createdAt"`
}
