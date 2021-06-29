use serde::{Serialize, Deserialize};

pub type ToDoId = u64;

#[derive(Serialize, Deserialize)]
pub struct CreateRequest {
    pub description:String
}

#[derive(Serialize, Deserialize)]
pub struct UpdateRequest {
    pub description:Option<String>,
    pub completed: Option<bool>
}

#[derive(Serialize, Deserialize)]
pub struct ClearResponse {
    total: usize
}

impl ClearResponse {
    pub fn new(total:usize) -> ClearResponse {
        ClearResponse { total }
    }
}

#[derive(Serialize, Deserialize)]
pub struct RemoveResponse {
    pub id: ToDoId
}

impl RemoveResponse {
    pub fn new(id:ToDoId) -> RemoveResponse {
        RemoveResponse { id }
    }
}