package graphql

import (
	"golang/config"
	"golang/models"

	"github.com/graphql-go/graphql"
)

var userType = graphql.NewObject(graphql.ObjectConfig{
	Name: "User",
	Fields: graphql.Fields{
		"id":        &graphql.Field{Type: graphql.Int},
		"name":      &graphql.Field{Type: graphql.String},
		"email":     &graphql.Field{Type: graphql.String},
		"password":  &graphql.Field{Type: graphql.String},
		"createdAt": &graphql.Field{Type: graphql.String},
	},
})

// go/
// |	|-controllers/
// |	|	|-user_controller.go
// |	|-graphql/
// |	|	|-schema.go
// |	|-models/
// |	|	|-post.go
// |	|	|-user.go
// |	|-routes/
// |	|	|-routes.go
// |-main.go

var RootQuery = graphql.NewObject(graphql.ObjectConfig{
	Name: "RootQuery",
	Fields: graphql.Fields{
		"users": &graphql.Field{
			Type: graphql.NewList(userType),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				rows, err := config.DB.Query(p.Context, `SELECT id, name, email, password, "createdAt" FROM "user"`)
				if err != nil {
					return nil, err
				}
				defer rows.Close()

				var users []models.User
				for rows.Next() {
					var u models.User
					if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.Password, &u.CreatedAt); err != nil {
						return nil, err
					}
					users = append(users, u)
				}
				return users, nil
			},
		},
	},
})

var RootMutation = graphql.NewObject(graphql.ObjectConfig{
	Name: "RootMutation",
	Fields: graphql.Fields{
		"createUser": &graphql.Field{
			Type: userType,
			Args: graphql.FieldConfigArgument{
				"name":     &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
				"email":    &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
				"password": &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.String)},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				name := p.Args["name"].(string)
				email := p.Args["email"].(string)
				password := p.Args["password"].(string)

				var user models.User
				err := config.DB.QueryRow(p.Context, `INSERT INTO "user"(name, email, password)
					VALUES ($1, $2, $3) RETURNING id, createdAt`,
					name, email, password,
				).Scan(&user.ID, &user.CreatedAt)

				if err != nil {
					return nil, err
				}

				user.Name = name
				user.Email = email
				user.Password = password

				return user, nil
			},
		},
	},
})

var Schema, _ = graphql.NewSchema(graphql.SchemaConfig{
	Query:    RootQuery,
	Mutation: RootMutation,
})
