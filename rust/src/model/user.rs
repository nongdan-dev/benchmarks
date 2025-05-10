use async_graphql::{Context, Object, Result};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use async_graphql::dataloader::DataLoader;

use crate::loaders::PostByUserIdLoader;
use crate::model::post::Post;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "user")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = true)]
    pub id: i32,
    pub name: String,
    #[sea_orm(unique)]
    pub email: String,
}

#[derive(Clone)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
}


pub type UserEntity = Entity;
#[Object]
impl User {
    async fn id(&self) -> i32 {
        self.id
    }

    async fn name(&self) -> &str {
        &self.name
    }

    async fn email(&self) -> &str {
        &self.email
    }

    async fn post(&self, ctx: &Context<'_>) -> Result<Vec<Post>> {
        let loader = ctx.data_unchecked::<DataLoader<PostByUserIdLoader>>();
        let posts = loader.load_one(self.id).await?;
        Ok(posts.unwrap_or_default())
    }
}



#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
