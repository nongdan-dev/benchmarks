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

	log.Println("starting on port 30000")

	if err := http.ListenAndServe(":30000", r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
