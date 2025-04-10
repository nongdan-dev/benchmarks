use actix_web::{web, App, HttpServer, Responder, HttpResponse};
use actix_web::web::Data;
use serde_json::json;
use sqlx::postgres::PgPoolOptions;
use tokio::net::TcpListener;
use tokio_tungstenite::accept_async;
use tokio_tungstenite::tungstenite::protocol::Message;
use futures_util::{StreamExt, SinkExt};
use clap::Parser;

#[derive(Parser)]
struct Cli {
    #[arg(default_value = "world")]
    name: String,
}

async fn api_handler() -> impl Responder {
    HttpResponse::Ok().json(json!({ "message": "Hello from Rust REST API!" }))
}

async fn pg_count_handler(db_pool: Data<sqlx::PgPool>) -> impl Responder {
    let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM users")
        .fetch_one(db_pool.get_ref()).await.unwrap();
    HttpResponse::Ok().json(json!({ "count": count.0 }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let cli = Cli::parse();
    println!("Hello, {} from Rust CLI!", cli.name);

    let db_pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres://postgres:100845@localhost/demoRustdb").await.unwrap();

    let db_data = Data::new(db_pool.clone());

    let http_addr  = "127.0.0.1:3001";
    let ws_addr = "127.0.0.1:3010";

    let http_server = HttpServer::new(move || {
        App::new()
            .app_data(db_data.clone())
            .route("/api", web::get().to(api_handler))
            .route("/pg-count", web::get().to(pg_count_handler))
    })
    .bind(http_addr)?
    .run();

    println!("HTTP server running at http://{}", http_addr);

    let ws_listener = TcpListener::bind(ws_addr).await.unwrap();
    println!("WebSocket server running at ws://{}", ws_addr);

    tokio::spawn(async move {
        loop {
            let (stream, _) = ws_listener.accept().await.unwrap();
            tokio::spawn(async move {
                let ws_stream = accept_async(stream).await.unwrap();
                let (mut write, mut read) = ws_stream.split();
                while let Some(Ok(msg)) = read.next().await {
                    if msg.is_text() {
                        let reply = format!("Echo from Rust: {}", msg.to_text().unwrap());
                        write.send(Message::text(reply)).await.unwrap();
                    }
                }
            });
        }
    });

    http_server.await
}
