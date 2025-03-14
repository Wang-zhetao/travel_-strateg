use warp::{Filter, filters::BoxedFilter, Reply};
use uuid::Uuid;

use crate::handlers;
use crate::models::{CreateGuideRequest, UpdateGuideRequest};
use crate::error::handle_rejection;

// 路由根路径
const API_PATH: &str = "api";

// 组合所有攻略相关的路由
pub fn guide_routes() -> BoxedFilter<(impl Reply,)> {
    get_guides()
        .or(get_guide())
        .or(create_guide())
        .or(update_guide())
        .or(delete_guide())
        .recover(handle_rejection)
        .boxed()
}

// 获取所有攻略
fn get_guides() -> BoxedFilter<(impl Reply,)> {
    warp::path(API_PATH)
        .and(warp::path("guides"))
        .and(warp::get())
        .and_then(handlers::get_guides)
        .boxed()
}

// 获取单个攻略
fn get_guide() -> BoxedFilter<(impl Reply,)> {
    warp::path(API_PATH)
        .and(warp::path("guides"))
        .and(warp::path::param::<Uuid>())
        .and(warp::get())
        .and_then(handlers::get_guide)
        .boxed()
}

// 创建新攻略
fn create_guide() -> BoxedFilter<(impl Reply,)> {
    warp::path(API_PATH)
        .and(warp::path("guides"))
        .and(warp::post())
        .and(json_body::<CreateGuideRequest>())
        .and_then(handlers::create_guide)
        .boxed()
}

// 更新攻略
fn update_guide() -> BoxedFilter<(impl Reply,)> {
    warp::path(API_PATH)
        .and(warp::path("guides"))
        .and(warp::path::param::<Uuid>())
        .and(warp::put())
        .and(json_body::<UpdateGuideRequest>())
        .and_then(handlers::update_guide)
        .boxed()
}

// 删除攻略
fn delete_guide() -> BoxedFilter<(impl Reply,)> {
    warp::path(API_PATH)
        .and(warp::path("guides"))
        .and(warp::path::param::<Uuid>())
        .and(warp::delete())
        .and_then(handlers::delete_guide)
        .boxed()
}

// 辅助函数：从请求体解析JSON
fn json_body<T>() -> impl Filter<Extract = (T,), Error = warp::Rejection> + Clone
where
    T: Send + for<'de> serde::de::Deserialize<'de>,
{
    warp::body::content_length_limit(1024 * 16)
        .and(warp::body::json())
        .map(|value: T| value)
}
