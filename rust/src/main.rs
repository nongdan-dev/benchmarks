use actix_web::{get, App, HttpServer, Responder, HttpResponse};

#[get("/")]
async fn index() -> impl Responder {
    HttpResponse::Ok().body("Hello from Rust!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Rust server running on http://localhost:3001");
    HttpServer::new(|| App::new().service(index))
        .bind("0.0.0.0:3001")?
        .run()
        .await
}
