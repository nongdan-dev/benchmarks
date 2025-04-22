package controllers

import (
	"encoding/json"
	"golang/config"
	"golang/models"
	"net/http"
)

func CreateUser(w http.ResponseWriter, r *http.Request) {
	var u models.User
	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
	}

	err := config.DB.QueryRow(r.Context(), `INSERT INTO "user"(name, email, password)
	VALUES ($1, $2, $3) RETURNING id, create_at`, u.Name, u.Email, u.Password).Scan(&u.ID, &u.CreatedAt)

	if err != nil {
		http.Error(w, `Failed to create user: `+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(u)
}

func GetUsers(w http.ResponseWriter, r *http.Request) {
	rows, err := config.DB.Query(r.Context(), `SELECT * FROM "user"`)

	if err != nil {
		http.Error(w, `Can not query`, http.StatusInternalServerError)
	}

	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.Password, &u.CreatedAt); err != nil {
			http.Error(w, "Failed to scan user: "+err.Error(), http.StatusInternalServerError)
			return
		}
		users = append(users, u)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(users)
}
