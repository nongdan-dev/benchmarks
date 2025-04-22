package config

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/jackc/pgx/v4/pgxpool"
)

var DB *pgxpool.Pool

func ConnectDB() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Warning: .env file not found")
	}

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		panic("DATABASE_URL not set in environment")
	}

	// Kết nối tới PostgreSQL
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := pgxpool.Connect(ctx, dsn)
	if err != nil {
		panic(fmt.Sprintf("Unable to connect to database: %v\n", err))
	}

	DB = pool
	fmt.Println("Connected to PostgreSQL!")
}
