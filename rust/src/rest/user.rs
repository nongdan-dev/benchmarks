use actix_web::{get, post, web, HttpResponse, Responder};
use sea_orm::{EntityTrait, Set, ColumnTrait, QueryFilter, DatabaseConnection};
use crate::models::user::{Entity as UserEntity, Column as UserColumn, ActiveModel as UserActiveModel };
use chrono::Utc;

#[get("/users")]
pub async fn get_users(db: web::Data<DatabaseConnection>) -> impl Responder {
    match UserEntity::find().all(db.get_ref()).await {
        Ok(users) => HttpResponse::Ok().json(users),
        Err(_) => HttpResponse::InternalServerError().body("Database error"),
    }
}

#[get("/users/{id}")]
pub async fn get_user_by_id(
    db: web::Data<DatabaseConnection>,
    id: web::Path<i32>,
) -> impl Responder {
    let user_id = id.into_inner();

    match UserEntity::find()
        .filter(UserColumn::Id.eq(user_id))
        .one(db.get_ref())
        .await
    {
        Ok(Some(user)) => HttpResponse::Ok().json(user),
        Ok(None) => HttpResponse::NotFound().body("User not found"),
        Err(_) => HttpResponse::InternalServerError().body("Database error"),
    }
}

#[derive(serde::Deserialize)]
pub struct UserCreateRequest {
    pub name: String,
    pub email: String,
    pub password: String,
}

#[post("/users")]
pub async fn create_user(
    db: web::Data<DatabaseConnection>,
    new_user: web::Json<UserCreateRequest>,
) -> impl Responder {
    let new_user_model = UserActiveModel {
        name: Set(new_user.name.clone()),
        email: Set(new_user.email.clone()),
        password: Set(new_user.password.clone()),
        created_at: Set(Some(Utc::now())),
        ..Default::default()
    };

    match UserEntity::insert(new_user_model)
        .exec(db.get_ref())
        .await
    {
        Ok(_) => HttpResponse::Created().body("User created successfully"),
        Err(_) => HttpResponse::InternalServerError().body("Database error"),
    }
}
