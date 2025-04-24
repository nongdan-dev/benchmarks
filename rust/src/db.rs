use sea_orm::{Database, DatabaseConnection, ConnectOptions};
use std::env;

pub async fn establish_connection() -> DatabaseConnection {
    let host = env::var("POSTGRES_HOST").expect("POSTGRES_HOST must be set");
    let port = env::var("POSTGRES_PORT").expect("POSTGRES_PORT must be set");
    let user = env::var("POSTGRES_USER").expect("POSTGRES_USER must be set");
    let password = env::var("POSTGRES_PASSWORD").expect("POSTGRES_PASSWORD must be set");
    let database = env::var("POSTGRES_DB").expect("POSTGRES_DB must be set");

    let database_url = format!("postgres://{}:{}@{}:{}/{}", user, password, host, port, database);

    println!("Connecting to database at: {}", database_url);

    let connect_options = ConnectOptions::new(database_url);
    Database::connect(connect_options)
        .await
        .expect("Failed to connect to database")
}
