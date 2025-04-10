use actix_web::{get, Responder, HttpResponse, web, App, HttpServer};
use sqlx::{PgPool, Row};
use chrono::{DateTime, Utc};

#[get("/")]
async fn index(db: web::Data<PgPool>) -> impl Responder {
    let row = match sqlx::query("SELECT NOW()")
        .fetch_one(db.get_ref())
        .await
    {
        Ok(r) => r,
        Err(e) => {
            eprintln!("❌ DB query failed: {:?}", e);
            return HttpResponse::InternalServerError().body("Database error");
        }
    };

    let now: DateTime<Utc> = row.get(0);
    HttpResponse::Ok().body(format!("Hello from Rust! Time: {}", now))
}

pub async fn run_api_with_port(port: u16) -> std::io::Result<()> {
    let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL not set");
    let pool = match PgPool::connect(&db_url).await {
        Ok(p) => p,
        Err(e) => {
            eprintln!("❌ Failed to connect to DB: {:?}", e);
            std::process::exit(1);
        }
    };

    let data = web::Data::new(pool);

    println!("🚀 Starting Rust API on http://127.0.0.1:{}", port);

    HttpServer::new(move || {
        App::new()
            .app_data(data.clone())
            .service(index)
    })
    .bind(("127.0.0.1", port))?
    .run()
    .await
}

pub async fn run_api() -> std::io::Result<()> {
    run_api_with_port(8080).await
}
