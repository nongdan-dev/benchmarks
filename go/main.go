package main

import (
	"golang/config"
	"golang/routes"
	"log"
	"net/http"
)

func main() {
	config.ConnectDB()

	r := routes.SetupRouter()

	log.Println("Server is running GraphQL at http://localhost:4300/graphql")
	log.Println("Server is running Rest at http://localhost:4300")

	if err := http.ListenAndServe(":4300", r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
