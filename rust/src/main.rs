mod db;
mod models;
mod handlers;
mod rest;

use rest::user::{get_users, create_user, get_user_by_id};
use actix_web::{App, HttpServer, web};
use async_graphql::{Schema, EmptySubscription};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use sea_orm::DatabaseConnection;

use handlers::{QueryRoot, MutationRoot};
use db::establish_connection;

use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use actix_web::{HttpResponse, Responder};

async fn graphql_playground() -> impl Responder {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(playground_source(GraphQLPlaygroundConfig::new("/graphql")))
}

async fn graphql_handler(
    schema: web::Data<Schema<QueryRoot, MutationRoot, EmptySubscription>>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = "3001";
    let pool: DatabaseConnection = establish_connection().await;

    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(pool.clone())
        .finish();

    println!("🚀 Server running at http://127.0.0.1:{}/graphql", port);

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(schema.clone()))
            .route("/graphql", web::post().to(graphql_handler))
            .route("/graphql", web::get().to(graphql_playground))
            .service(get_users)
            .service(get_user_by_id)
            .service(create_user)
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}
