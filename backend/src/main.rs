mod models;
mod handlers;
mod routes;
mod db;
mod error;

use std::env;
use warp::Filter;
use log::info;
use dotenv::dotenv;

#[tokio::main]
async fn main() {
    // 加载.env文件
    dotenv().ok();
    
    // 初始化日志
    env_logger::init();
    
    // 检查DEEPSEEK_API_KEY是否存在
    let api_key = env::var("DEEPSEEK_API_KEY").ok();
    if let Some(key) = api_key {
        info!("DeepSeek API key found, length: {}", key.len());
    } else {
        info!("Warning: DeepSeek API key not found in environment");
    }
    
    // 默认端口为8080，可通过环境变量设置
    let port = env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse::<u16>()
        .expect("PORT must be a number");
    
    // 获取路由
    let routes = routes::routes();
    
    // 添加CORS支持
    let routes = routes.with(
        warp::cors()
            .allow_any_origin()
            .allow_headers(vec!["content-type"])
            .allow_methods(vec!["GET", "POST", "PUT", "DELETE"]),
    );
    
    info!("Server started on port {}", port);
    
    // 启动服务器
    warp::serve(routes).run(([0, 0, 0, 0], port)).await;
}
