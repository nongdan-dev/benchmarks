use sea_orm::{Database, DatabaseConnection, ConnectOptions}; // Import ConnectOptions from SeaORM
use std::env;
use dotenvy::dotenv;


pub async fn establish_connection() -> DatabaseConnection {
    dotenv().ok(); // Load environment variables from .env file
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    println!("Connecting to database at: {}", database_url);

    // Create ConnectOptions from the database_url directly
    let connect_options = ConnectOptions::new(database_url);

    // Correctly use Database::connect with the connect_options
    Database::connect(connect_options)
        .await
        .expect("Failed to connect to database")
}




// use sea_orm::{Database, DatabaseConnection};
// use std::env;
// use dotenvy::dotenv;

// pub async fn establish_connection() -> DatabaseConnection {
//     dotenv().ok();
//     let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
//     Database::connect(&database_url).await.expect("Failed to connect to database")
// }