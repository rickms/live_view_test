use actix_web::{web};
use actix_web::*;

use todo_common::{ClearResponse, CreateRequest, RemoveResponse, ToDoId, UpdateRequest};

use crate::app::{AppState, ToDo};
use crate::services::{ApiError, ApiResponse};

#[get("/api/todo")]
pub async fn get_todos(data: web::Data<AppState>) -> Result<ApiResponse<Vec<ToDo>>, ApiError> {
    Ok(ApiResponse::Ok { data: data.read()?.todos().to_vec() })
}

#[post("/api/todo")]
pub async fn create_todo(app_state: web::Data<AppState>, request: web::Json<CreateRequest>) -> Result<ApiResponse<ToDo>, ApiError> {
    Ok(ApiResponse::Ok { data: app_state.write()?.add_todo(request.description.as_str())?} )
}

#[delete("/api/todo")]
pub async fn clear_todos(app_state: web::Data<AppState>) -> Result<ApiResponse<ClearResponse>, ApiError> {
    Ok(ApiResponse::Ok { data: ClearResponse::new(app_state.write()?.clear_todos()?)})
}

#[delete("/api/todo/{id}")]
pub async fn delete_todo(app_state: web::Data<AppState>, path: web::Path<(ToDoId,)>) -> Result<ApiResponse<RemoveResponse>, ApiError>{
    let (id, ) = path.into_inner();
    Ok(ApiResponse::Ok { data: RemoveResponse::new(app_state.write()?.remove_todo(id)?) })
}

#[put("/api/todo/{id}")]
pub async fn update_todo(app_state: web::Data<AppState>, path: web::Path<(ToDoId,)>, request: web::Json<UpdateRequest>) -> Result<ApiResponse<ToDo>, ApiError> {
    let (id, ) = path.into_inner();
    Ok(ApiResponse::Ok { data: app_state.write()?.update_todo(id, request.into_inner())? })
}