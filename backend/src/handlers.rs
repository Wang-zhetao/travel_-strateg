use warp::{reject, reply::json, Reply};
use uuid::Uuid;
use chrono::Utc;
use log::{debug, error};
use serde_json::json;

use crate::db;
use crate::models::{Guide, CreateGuideRequest, UpdateGuideRequest};

// 创建新攻略
pub async fn create_guide(req: CreateGuideRequest) -> Result<impl Reply, warp::Rejection> {
    debug!("Creating guide: {:?}", req);
    
    let guide = Guide {
        id: Uuid::new_v4(),
        title: req.title,
        main_image: req.main_image,
        tags: req.tags,
        content: req.content,
        created_at: Utc::now(),
        updated_at: Utc::now(),
    };
    
    match db::store().create_guide(guide) {
        Ok(created) => Ok(json(&created)),
        Err(e) => {
            error!("Failed to create guide: {:?}", e);
            Err(reject::custom(e))
        }
    }
}

// 获取所有攻略
pub async fn get_guides() -> Result<impl Reply, warp::Rejection> {
    debug!("Getting all guides");
    
    let guides = db::store().get_guides();
    Ok(json(&guides))
}

// 获取单个攻略
pub async fn get_guide(id: Uuid) -> Result<impl Reply, warp::Rejection> {
    debug!("Getting guide with id: {}", id);
    
    match db::store().get_guide(id) {
        Ok(guide) => Ok(json(&guide)),
        Err(e) => {
            error!("Failed to get guide: {:?}", e);
            Err(reject::custom(e))
        }
    }
}

// 更新攻略
pub async fn update_guide(id: Uuid, req: UpdateGuideRequest) -> Result<impl Reply, warp::Rejection> {
    debug!("Updating guide with id: {}", id);
    
    // 先获取现有的攻略
    let current = match db::store().get_guide(id) {
        Ok(guide) => guide,
        Err(e) => return Err(reject::custom(e)),
    };
    
    // 使用请求中的字段更新攻略
    let updated = Guide {
        id,
        title: req.title.unwrap_or(current.title),
        main_image: req.main_image.unwrap_or(current.main_image),
        tags: req.tags.unwrap_or(current.tags),
        content: req.content.unwrap_or(current.content),
        created_at: current.created_at,
        updated_at: Utc::now(),
    };
    
    match db::store().update_guide(id, updated) {
        Ok(guide) => Ok(json(&guide)),
        Err(e) => {
            error!("Failed to update guide: {:?}", e);
            Err(reject::custom(e))
        }
    }
}

// 删除攻略
pub async fn delete_guide(id: Uuid) -> Result<impl Reply, warp::Rejection> {
    debug!("Deleting guide with id: {}", id);
    
    match db::store().delete_guide(id) {
        Ok(_) => Ok(json(&json!({ "success": true, "message": "Guide deleted" }))),
        Err(e) => {
            error!("Failed to delete guide: {:?}", e);
            Err(reject::custom(e))
        }
    }
}
