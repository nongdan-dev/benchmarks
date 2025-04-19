use sea_orm::{Database, DatabaseConnection, ConnectOptions};
use std::env;
use dotenvy::dotenv;


// pub async fn establish_connection() -> DatabaseConnection {
//     dotenv().ok();
//     let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
//     println!("Connecting to database at: {}", database_url);

//     let connect_options = ConnectOptions::new(database_url);
//     Database::connect(connect_options)
//         .await
//         .expect("Failed to connect to database")
// }



pub async fn establish_connection() -> DatabaseConnection {
    dotenv().ok();

    let user = env::var("DB_USER").expect("DB_USER must be set");
    let password = env::var("DB_PASSWORD").expect("DB_PASSWORD must be set");
    let host = env::var("DB_HOST").expect("DB_HOST must be set");
    let port = env::var("DB_PORT").expect("DB_PORT must be set");
    let database = env::var("DATABASE").expect("DATABASE must be set");

    let database_url = format!("postgres://{}:{}@{}:{}/{}", user, password, host, port, database);

    println!("Connecting to database at: {}", database_url);

    let connect_options = ConnectOptions::new(database_url);
    Database::connect(connect_options)
        .await
        .expect("Failed to connect to database")
}
