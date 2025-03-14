#![allow(dead_code)]
use thiserror::Error;
use warp::{reject::Reject, Rejection, Reply, http::StatusCode};
use serde_json::json;

#[derive(Error, Debug)]
pub enum Error {
    #[error("Guide not found")]
    GuideNotFound,
    
    #[error("Invalid input: {0}")]
    InvalidInput(String),
    
    #[error("Internal server error: {0}")]
    InternalServerError(String),
}

impl Reject for Error {}

// 
pub fn internal_error() -> Error {
    Error::InternalServerError("Internal server error".to_string())
}

pub async fn handle_rejection(err: Rejection) -> Result<impl Reply, Rejection> {
    let (code, message) = if err.is_not_found() {
        (StatusCode::NOT_FOUND, "Not Found".to_string())
    } else if let Some(error) = err.find::<Error>() {
        match error {
            Error::GuideNotFound => (StatusCode::NOT_FOUND, error.to_string()),
            Error::InvalidInput(_) => (StatusCode::BAD_REQUEST, error.to_string()),
            Error::InternalServerError(_) => (StatusCode::INTERNAL_SERVER_ERROR, error.to_string()),
        }
    } else {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Internal Server Error".to_string(),
        )
    };

    let json = warp::reply::json(&json!({
        "error": message,
    }));

    Ok(warp::reply::with_status(json, code))
}
