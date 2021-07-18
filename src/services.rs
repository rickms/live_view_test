use actix_files::NamedFile;
use actix_web::*;
use serde::{Serialize, Deserialize};
use std::future::{Ready, ready};
use std::sync::{PoisonError, RwLockReadGuard, RwLockWriteGuard};
use crate::app::{State, StateChangeError};
use actix_web::http::{StatusCode, header};
use actix_web::dev::HttpResponseBuilder;
use thiserror::Error;

pub mod todo;

// We use the thiserror crate to simplify our error enum and Display implementation
#[derive(Error, Debug )]
pub enum ApiError {
    #[error("Internal Error")]
    PoisonError, // From implemented manually below
    #[error("")]
    StateChangeError(#[from] StateChangeError)
}

// Generalized container for api responses.  All responses will return either { data: ... } or { error: ... }
// for simplified front end response parsing
#[derive(Serialize, Deserialize)]
#[serde(untagged)]
pub enum ApiResponse<T> {
    Ok { data:T },
    Err { error: String }
}

// Simple From trait to allow use of the try(?) operator in conjunction with RwLock::read()
impl<'a> From<PoisonError<RwLockReadGuard<'a, State>>> for ApiError {
    fn from(_:PoisonError<std::sync::RwLockReadGuard<'a, State>>) -> ApiError { ApiError::PoisonError }
}

// Simple From trait to allow use of the try(?) operator in conjunction with RwLock::write()
impl<'a> From<PoisonError<RwLockWriteGuard<'a, State>>> for ApiError {
    fn from(_:PoisonError<RwLockWriteGuard<'a, State>>) -> ApiError {
        ApiError::PoisonError
    }
}

// Here we implement ResponseError for ApiError. This allows automatic response generation for
// any error one of our handlers may return. This can be further specialized to return
// different response codes (401, 404, 500, etc) based on the error the api returned.
// For now we always return 200 (Ok) and serialize the error.
impl error::ResponseError for ApiError where Self: std::error::Error {
    fn status_code(&self) -> StatusCode {
        StatusCode::OK
    }

    fn error_response(&self) -> HttpResponse {
        let response = ApiResponse::<()>::Err { error: self.to_string() };
        let body = serde_json::to_string(&response).unwrap_or("Internal Error".to_owned());

        HttpResponseBuilder::new(self.status_code())
            .set_header(header::CONTENT_TYPE, "application/json")
            .body(body)
    }
}

// Implement Responder for ApiResponse<T>. This allows us a common place to define how our
// handler function responses are translated into HTTP responses.
impl<T> Responder for ApiResponse<T> where Self: Serialize, T:Serialize {
    type Error = ApiError;
    type Future = Ready<Result<HttpResponse, Self::Error>>;

    fn respond_to(self, _req: &HttpRequest) -> Self::Future {
        let body = serde_json::to_string(&self).unwrap();

        // Create response and set content type
        ready(Ok(HttpResponse::Ok()
            .content_type("application/json")
            .body(body)))
    }
}

#[get("/")]
pub async fn page() -> actix_web::Result<NamedFile> {
    Ok(NamedFile::open("./app_ts/build/index.html")?)
}
