use seed::prelude::*;
use crate::{ApiResponse, ToDo};
use todo_common::{ClearResponse, ToDoId, UpdateRequest, CreateRequest, RemoveResponse};

pub async fn get_todos() -> fetch::Result<ApiResponse<Vec<ToDo>>> {
    Request::new("/api/todo")
        .method(fetch::Method::Get)
        .fetch()
        .await?
        .check_status()?
        .json()
        .await
}

pub async fn add_todo(description: String) -> fetch::Result<ApiResponse<ToDo>> {
    Request::new("/api/todo")
        .method(fetch::Method::Post)
        .json(&CreateRequest { description })?
        .fetch()
        .await?
        .check_status()?
        .json()
        .await
}

pub async fn remove_todo(id: ToDoId) -> fetch::Result<ApiResponse<RemoveResponse>> {
    Request::new(format!("/api/todo/{0}", id))
        .method(fetch::Method::Delete)
        .fetch()
        .await?
        .check_status()?
        .json()
        .await
}

pub async fn clear_todo() -> fetch::Result<ApiResponse<ClearResponse>> {
    Request::new("/api/todo")
        .method(fetch::Method::Delete)
        .fetch()
        .await?
        .check_status()?
        .json()
        .await
}

pub async fn update_todo(
    id: ToDoId,
    update_request: UpdateRequest,
) -> fetch::Result<ApiResponse<ToDo>> {
    Request::new(format!("/api/todo/{0}", id))
        .method(fetch::Method::Put)
        .json(&update_request)?
        .fetch()
        .await?
        .check_status()?
        .json()
        .await
}
