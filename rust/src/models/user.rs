use sea_orm::entity::prelude::*;
use serde::{Serialize, Deserialize};
use async_graphql::SimpleObject;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "user")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = true)]
    pub id: i32,
    pub name: String,
    pub password: String,
    #[sea_orm(unique)]
    pub email: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}

#[derive(SimpleObject)]
pub struct UserGraphQL {
    pub id: String,
    pub name: String,
    pub email: String,
}

impl From<Model> for UserGraphQL {
    fn from(model: Model) -> Self {
        Self {
            id: model.id.to_string(),
            name: model.name,
            email: model.email,
        }
    }
}
