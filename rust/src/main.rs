mod db;
mod models;
mod handlers;

use actix_web::{App, HttpServer, web};
use async_graphql::{Schema, EmptySubscription};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use sea_orm::DatabaseConnection;

use handlers::{QueryRoot, MutationRoot}; // Import từ `handlers/mod.rs`
use db::establish_connection;

/// Xử lý GraphQL requests
async fn graphql_handler(
    schema: web::Data<Schema<QueryRoot, MutationRoot, EmptySubscription>>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().ok(); // Load biến môi trường từ .env

    // Lấy PORT, fallback về 3001 nếu không đặt
    let port = std::env::var("PORT").unwrap_or_else(|_| "3001".to_string());

    // Kết nối database
    let pool: DatabaseConnection = establish_connection().await;

    // Tạo GraphQL schema
    let schema = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(pool.clone())
        .finish();

    println!("🚀 Server running at http://127.0.0.1:{}/graphql", port);

    // Khởi chạy Actix server với PORT từ biến môi trường
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(schema.clone()))
            .route("/graphql", web::post().to(graphql_handler))
    })
    .bind(format!("127.0.0.1:{}", port))?
    .run()
    .await
}
