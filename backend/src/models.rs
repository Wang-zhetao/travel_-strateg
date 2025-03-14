use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

// 旅游攻略的章节
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Section {
    pub title: String,
    pub content: String,
    #[serde(rename = "type")]
    pub section_type: String,
}

// 旅游攻略
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Guide {
    #[serde(default = "Uuid::new_v4")]
    pub id: Uuid,
    pub title: String,
    #[serde(rename = "mainImage")]
    pub main_image: String,
    pub tags: Vec<String>,
    pub content: Vec<Section>,
    #[serde(default = "Utc::now")]
    pub created_at: DateTime<Utc>,
    #[serde(default = "Utc::now")]
    pub updated_at: DateTime<Utc>,
}

// 创建新攻略的请求
#[derive(Debug, Deserialize)]
pub struct CreateGuideRequest {
    pub title: String,
    #[serde(rename = "mainImage")]
    pub main_image: String,
    pub tags: Vec<String>,
    pub content: Vec<Section>,
}

// 更新攻略的请求
#[derive(Debug, Deserialize)]
pub struct UpdateGuideRequest {
    pub title: Option<String>,
    #[serde(rename = "mainImage")]
    pub main_image: Option<String>,
    pub tags: Option<Vec<String>>,
    pub content: Option<Vec<Section>>,
}
