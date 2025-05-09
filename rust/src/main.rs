mod model;
// use model::*;
mod loaders;
use loaders::{PostLoader, UserLoader, PostByUserIdLoader};


// use anyhow::Context as _;
use async_graphql::{ dataloader::DataLoader, Context, EmptyMutation, EmptySubscription, Object, Result, Schema};
use async_graphql_axum::GraphQL;
use axum::{Router, routing::post_service, serve};
use model::post::PostEntity;
use sea_orm::{entity::prelude::*, ConnectOptions, Database, DatabaseConnection};
use std::{
    // env,
    error::Error
};
use tokio::net::TcpListener;



#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let pool: DatabaseConnection = db_conn().await?;
    let schema = Schema::build(QueryRoot, EmptyMutation, EmptySubscription)
        .data(pool.clone())
        .data(DataLoader::new(PostLoader(pool.clone()), tokio::spawn))
        .data(DataLoader::new(UserLoader(pool.clone()), tokio::spawn))
        .data(DataLoader::new(PostByUserIdLoader(pool.clone()), tokio::spawn))
        .finish();
    let app = Router::new().route("/graphql", post_service(GraphQL::new(schema)));

    let port = 30000;
    // https://docs.rs/tokio/1.44.2/src/tokio/runtime/builder.rs.html#386
    println!("rust using {} cpu", num_cpus::get());
    println!("rust listening on port {}", port);

    let addr = format!("0.0.0.0:{}", port);
    let listener = TcpListener::bind(addr).await?;
    serve(listener, app).await?;

    Ok(())
}

// ----------------------------------------------------------------------------
// db connection
pub async fn db_conn() -> Result<DatabaseConnection, Box<dyn Error>> {
    // fn e(k: &str) -> Result<String, Box<dyn Error>> {
    //     let v = env::var(k).context("missing env ".to_owned() + k)?;
    //     Ok(v)
    // }
    // let h = e("POSTGRES_HOST")?;
    // let p = e("POSTGRES_PORT")?;
    // let u = e("POSTGRES_USER")?;
    // let pw = e("POSTGRES_PASSWORD")?;
    // let db = e("POSTGRES_DB")?;
    // let url = format!("postgres://{}:{}@{}:{}/{}", u, pw,h, p, db);
    let url = format!("postgres://{}:{}@{}:{}/{}", "postgres", "100845","localhost", "5432", "demoRustdb");
    let conn = Database::connect(ConnectOptions::new(url)).await?;
    Ok(conn)
}



// ----------------------------------------------------------------------------
// graphql handler
#[derive(Default)]
pub struct QueryRoot;
#[Object]
impl QueryRoot {
    async fn users(&self, ctx: &Context<'_>) -> Result<Vec<model::user::User>> {
        let db = ctx.data::<DatabaseConnection>()?;
        let models = model::user::UserEntity::find().all(db).await?;
        Ok(models
            .into_iter()
            .map(|m| model::user::User {
                id: m.id,
                name: m.name,
                email: m.email,
            })
            .collect())
    }

    async fn user(&self, ctx: &Context<'_>, id: i32) -> Result<Option<model::user::User>> {
        let loader = ctx.data_unchecked::<DataLoader<UserLoader>>();
        loader.load_one(id).await
    }

    async fn posts(&self, ctx: &Context<'_>) -> Result<Vec<model::post::Post>> {
        let db = ctx.data::<DatabaseConnection>()?;
        let data = PostEntity::find().all(db).await?;
        Ok(data)
    }

}