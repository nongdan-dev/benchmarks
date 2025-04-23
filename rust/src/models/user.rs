use sea_orm::entity::prelude::*;
use serde::{Serialize, Deserialize};
use async_graphql::SimpleObject;
use chrono::{DateTime, Utc};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "user")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = true)]
    pub id: i32,
    pub name: String,
    pub password: String,
    #[sea_orm(unique)]
    pub email: String,
    #[sea_orm(column_name = "createdAt")]
    pub created_at: Option<DateTime<Utc>>
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}

#[derive(SimpleObject)]
pub struct UserGraphQL {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub password: String,
}

impl From<Model> for UserGraphQL {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            name: model.name,
            email: model.email,
            password: model.password,
        }
    }
}
