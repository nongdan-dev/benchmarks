package routes

import (
	"golang/controllers"
	"net/http"

	gql "golang/graphql"

	"github.com/gorilla/mux"
	"github.com/graphql-go/handler"
)

func SetupRouter() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/users", controllers.GetUsers).Methods(http.MethodGet)
	router.HandleFunc("/users", controllers.CreateUser).Methods(http.MethodPost)

	graphQLHandler := handler.New(&handler.Config{
		Schema:   &gql.Schema,
		Pretty:   true,
		GraphiQL: true,
	})
	router.Handle("/graphql", graphQLHandler).Methods(http.MethodPost, http.MethodGet)

	return router
}
