use warp::{reject, reply::json, Reply};
use uuid::Uuid;
use chrono::Utc;
use log::{debug, error};
use serde_json::json;
use reqwest::Client;

use crate::db;
use crate::error;
use crate::models::{Guide, CreateGuideRequest, UpdateGuideRequest, ChatRequest, ChatResponse, ChatMessage};

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

// 使用DeepSeek大模型进行聊天
pub async fn chat_with_deepseek(req: ChatRequest) -> Result<impl Reply, warp::Rejection> {
    debug!("Received chat request: {:?}", req.message);
    
    // 创建HTTP客户端
    let client = Client::new();
    
    // 从环境变量中获取DeepSeek API密钥
    let deepseek_api_key = std::env::var("DEEPSEEK_API_KEY")
        .unwrap_or_else(|_| {
            debug!("DEEPSEEK_API_KEY not found in environment, using mock responses");
            "sk-mock-key".to_string()
        });
    
    // 构建消息历史
    let mut messages = Vec::new();
    
    // 如果有历史消息，先添加历史消息
    if let Some(history) = req.history {
        messages.extend(history);
    }
    
    // 添加用户的当前消息
    messages.push(ChatMessage {
        role: "user".to_string(),
        content: req.message.clone(),
    });
    
    // 构建请求体
    let request_body = json!({
        "model": "deepseek-chat",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1024
    });
    
    debug!("Sending request to DeepSeek API");
    
    // 判断是否使用模拟响应
    if deepseek_api_key == "sk-mock-key" {
        // 使用模拟响应
        let mock_response = match req.message.to_lowercase() {
            m if m.contains("你好") || m.contains("hi") || m.contains("hello") => {
                "你好！我是DeepSeek旅游助手，有什么可以帮助你的吗？".to_string()
            },
            m if m.contains("推荐") || m.contains("建议") => {
                "根据当前季节，我推荐你可以考虑去黄金海岸、三亚或者云南。这些地方气候宜人，风景优美，是很受欢迎的旅游胜地。".to_string()
            },
            m if m.contains("攻略") || m.contains("指南") => {
                "我们有各种旅游攻略可以提供！最受欢迎的包括'黄金海岸三日游'等。你可以在我们的网站上查看更多详细信息。".to_string()
            },
            m if m.contains("吃") || m.contains("美食") => {
                "旅游目的地的美食是体验当地文化的重要部分。例如，在海南可以品尝各种新鲜的海鲜；在云南可以尝试过桥米线、汽锅鸡等特色美食；在西安不能错过肉夹馍和各种面食。".to_string()
            },
            m if m.contains("住宿") || m.contains("酒店") => {
                "选择住宿时，可以考虑位置、价格和设施等因素。热门旅游城市通常有从经济型到豪华型的各种选择。建议提前预订，特别是在旅游旺季。".to_string()
            },
            _ => {
                "作为DeepSeek旅游助手，我可以为您提供旅游建议、目的地推荐、行程规划等信息。请告诉我您有什么具体的旅行需求？".to_string()
            }
        };
        
        let response = ChatResponse {
            message: mock_response,
            created_at: Utc::now(),
        };
        
        debug!("Sending mock chat response");
        Ok(json(&response))
    } else {
        // 真实API调用
        debug!("Using real DeepSeek API with key: {}...", &deepseek_api_key[..8]);
        
        let api_url = "https://api.deepseek.com/v1/chat/completions";
        
        let response = client.post(api_url)
            .header("Content-Type", "application/json")
            .header("Authorization", format!("Bearer {}", deepseek_api_key))
            .json(&request_body)
            .send()
            .await;
        
        match response {
            Ok(res) => {
                if res.status().is_success() {
                    match res.json::<serde_json::Value>().await {
                        Ok(data) => {
                            debug!("Received successful response from DeepSeek API");
                            
                            // 从API响应中提取assistant的消息
                            let message = data["choices"][0]["message"]["content"]
                                .as_str()
                                .unwrap_or("抱歉，我无法处理这个请求。")
                                .to_string();
                            
                            let response = ChatResponse {
                                message,
                                created_at: Utc::now(),
                            };
                            
                            Ok(json(&response))
                        },
                        Err(e) => {
                            error!("Failed to parse API response: {:?}", e);
                            Err(reject::custom(error::internal_error()))
                        }
                    }
                } else {
                    error!("API request failed: {}", res.status());
                    Err(reject::custom(error::internal_error()))
                }
            },
            Err(e) => {
                error!("Failed to send request to API: {:?}", e);
                Err(reject::custom(error::internal_error()))
            }
        }
    }
}
