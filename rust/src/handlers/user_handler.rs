use sea_orm::{EntityTrait, Set, ColumnTrait, QueryFilter, ActiveModelTrait};
use sea_orm::DatabaseConnection;
// use crate::models::user::{Entity as UserEntity, ActiveModel as UserActiveModel, UserGraphQL};
use crate::models::user::{self, Entity as UserEntity, ActiveModel as UserActiveModel, UserGraphQL};
use async_graphql::{Context, Object, Result};
use chrono::Utc;
// use crate::models::user::{Column};


#[derive(Default)]
pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn users(&self, ctx: &Context<'_>) -> Result<Vec<UserGraphQL>> {
        let db = ctx.data::<DatabaseConnection>()?;
        let users = UserEntity::find()
            .all(db)
            .await
            .map_err(|_| "Database error")?;

        Ok(users.into_iter().map(UserGraphQL::from).collect())
    }

    async fn get_user(&self, ctx: &Context<'_>, id: String) -> Result<Option<UserGraphQL>> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user_id: i32 = id.parse().map_err(|_| "Invalid ID format")?; // Chuyển đổi String thành i32

        let user = UserEntity::find()
            .filter(crate::models::user::Column::Id.eq(user_id))  // Sử dụng i32 trong query
            .one(db)
            .await
            .map_err(|_| "Database error")?;

        Ok(user.map(UserGraphQL::from))
    }
}

#[derive(Default)]
pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn create_user(&self, ctx: &Context<'_>, name: String, email: String, password: String) -> Result<UserGraphQL> {
        let db = ctx.data::<DatabaseConnection>()?;

        // Kiểm tra email đã tồn tại chưa
        let existing = UserEntity::find()
        .filter(user::Column::Email.eq(email.clone()))
        .one(db)
        .await?;

        if existing.is_some() {
            return Err("Email already exists".into());
        }

        let new_user = UserActiveModel {
            name: Set(name),
            email: Set(email),
            password: Set(password),
            created_at: Set(Some(Utc::now())),
            ..Default::default()
        };

        let user = new_user.insert(db).await?;
        Ok(UserGraphQL::from(user))
    }

    async fn update_user(&self, ctx: &Context<'_>, id: String, name: String) -> Result<UserGraphQL> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user_id: i32 = id.parse().map_err(|_| "Invalid ID format")?; // Chuyển đổi String thành i32

        let user = UserEntity::find()
            .filter(crate::models::user::Column::Id.eq(user_id))  // Sử dụng i32 trong query
            .one(db)
            .await
            .map_err(|_| "Database error")?
            .ok_or("User not found")?;

        let mut user_active: UserActiveModel = user.into();
        user_active.name = Set(name);
        let updated_user = user_active.update(db).await.map_err(|_| "Update error")?;

        Ok(UserGraphQL::from(updated_user))
    }

    async fn delete_user(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<DatabaseConnection>()?;
        let user_id: i32 = id.parse().map_err(|_| "Invalid ID format")?; // Chuyển đổi String thành i32

        let result = UserEntity::delete_many()
            .filter(crate::models::user::Column::Id.eq(user_id))  // Sử dụng i32 trong query
            .exec(db)
            .await
            .map_err(|_| "Delete error")?;

        Ok(result.rows_affected > 0)
    }
}
