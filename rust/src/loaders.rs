// src/loaders.rs


use std::collections::HashMap;

use async_graphql::dataloader::Loader;
use async_graphql::FieldError;
use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, QueryFilter};

use crate::model::post::{Post, PostEntity};
use crate::model::user::{User, UserEntity};

/// Load từng Post theo ID
pub struct PostLoader(pub DatabaseConnection);

impl Loader<i32> for PostLoader {
    type Value = Post;
    type Error = FieldError;

    async fn load(&self, keys: &[i32]) -> Result<HashMap<i32, Self::Value>, Self::Error> {
        let posts = PostEntity::find()
            .filter(crate::model::user::Column::Id.is_in(keys.to_vec()))
            .all(&self.0)
            .await?;

        let map = posts
            .into_iter()
            .map(|post| (post.id, post))
            .collect::<HashMap<_, _>>();

        Ok(map)
    }
}

/// Load từng User theo ID
pub struct UserLoader(pub DatabaseConnection);

impl Loader<i32> for UserLoader {
    type Value = User;
    type Error = FieldError;

    async fn load(&self, keys: &[i32]) -> Result<HashMap<i32, Self::Value>, Self::Error> {
        let users = UserEntity::find()
            .filter(crate::model::user::Column::Id.is_in(keys.to_vec()))
            .all(&self.0)
            .await?;

        let map = users
            .into_iter()
            .map(|u| {
                (
                    u.id,
                    User {
                        id: u.id,
                        name: u.name,
                        email: u.email,
                    },
                )
            })
            .collect();

        Ok(map)
    }
}

/// Load toàn bộ Post theo `user_id` (1-n)
pub struct PostByUserIdLoader(pub DatabaseConnection);

impl Loader<i32> for PostByUserIdLoader {
    type Value = Vec<Post>;
    type Error = FieldError;

    async fn load(&self, keys: &[i32]) -> Result<HashMap<i32, Self::Value>, Self::Error> {
        let posts = PostEntity::find()
            .filter(crate::model::post::Column::UserId.is_in(keys.to_vec()))
            .all(&self.0)
            .await?;

        let mut map: HashMap<i32, Vec<Post>> = HashMap::new();
        for post in posts {
            map.entry(post.user_id).or_default().push(post);
        }

        Ok(map)
    }
}
