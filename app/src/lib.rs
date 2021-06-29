use seed::*;
use seed::prelude::*;
use serde::{Deserialize, Serialize};

use todo_common::{ClearResponse, RemoveResponse, UpdateRequest};

mod view;
mod request;

type ToDoId = u64;

#[derive(Serialize, Deserialize)]
pub struct ToDo {
    id: ToDoId,
    description: String,
    completed: bool,
}

#[derive(Default)]
pub struct Model {
    todos: Vec<ToDo>,
    new_todo_description: String,
    error: Option<String>,
}

pub enum Msg {
    NewToDoDescriptionChange(String),
    AddToDo,
    RemoveToDo(ToDoId),
    ClearToDos,
    UpdateCompletedState(ToDoId, bool),
    ToDosReceived(fetch::Result<ApiResponse<Vec<ToDo>>>),
    ToDoAdded(fetch::Result<ApiResponse<ToDo>>),
    ToDosCleared(fetch::Result<ApiResponse<ClearResponse>>),
    ToDoRemoved(fetch::Result<ApiResponse<RemoveResponse>>),
    ToDoUpdated(fetch::Result<ApiResponse<ToDo>>),
}
#[derive(Serialize, Deserialize)]
#[serde(untagged)]
pub enum ApiResponse<T> {
    Ok { data: T },
    Err { error: String },
}

// Validate an api request, folding the fetch::Result<ApiResponse<>> into a Result<>. This may seem
// redundant but it allows us to distinguish (if needed) between network/resource errors and actual
// API errors.
fn validate_api_request<T>(
    api_request_response: fetch::Result<ApiResponse<T>>,
) -> Result<T, String> {
    match api_request_response {
        Ok(ApiResponse::Ok { data: resp }) => Ok(resp),
        Ok(ApiResponse::Err { error: e }) => Err(format!("{:?}", e)),
        Err(e) => Err(format!("{:?}", e)),
    }
}

fn update(msg: Msg, model: &mut Model, orders: &mut impl Orders<Msg>) {
    use Msg::*;

    // clear the previous error on any new action
    model.error = None;

    match msg {
        NewToDoDescriptionChange(description) => {
            model.new_todo_description = description;
        }
        AddToDo => {
            let description = model.new_todo_description.trim().to_owned();
            if description.is_empty() {
                model.error = Some("Task description required".to_string());
                return;
            }

            orders.perform_cmd(async { Msg::ToDoAdded(request::add_todo(description).await) });
        }
        RemoveToDo(id) => {
            orders.perform_cmd(async move { Msg::ToDoRemoved(request::remove_todo(id).await) });
        }
        ClearToDos => {
            orders.perform_cmd(async { Msg::ToDosCleared(request::clear_todo().await) });
        }
        UpdateCompletedState(id, completed) => {
            orders.perform_cmd(async move {
                Msg::ToDoUpdated(
                    request::update_todo(
                        id,
                        UpdateRequest {
                            description: None,
                            completed: Some(completed),
                        },
                    )
                    .await,
                )
            });
        }
        ToDosReceived(resp) => match validate_api_request(resp) {
            Ok(resp) => model.todos = resp,
            Err(e) => model.error = Some(e),
        },
        ToDoAdded(resp) => match validate_api_request(resp) {
            Ok(resp) => {
                model.todos.push(resp);
                model.new_todo_description.clear();
            }
            Err(e) => model.error = Some(e),
        },
        ToDoRemoved(resp) => match validate_api_request(resp) {
            Ok(resp) => {
                if let Some(index) = model.todos.iter().position(|todo| todo.id == resp.id) {
                    model.todos.remove(index);
                } else {
                    model.error = Some(format!("Could not remove todo {0}", resp.id));
                }
            }
            Err(e) => model.error = Some(e),
        },
        ToDosCleared(resp) => match validate_api_request(resp) {
            Ok(_resp) => {
                model.todos.clear();
            }
            Err(e) => model.error = Some(e),
        },
        ToDoUpdated(resp) => match validate_api_request(resp) {
            Ok(resp) => {
                if let Some(index) = model.todos.iter().position(|todo| todo.id == resp.id) {
                    let mut todo = &mut model.todos[index];
                    todo.description = resp.description;
                    todo.completed = resp.completed;
                }
            }
            Err(e) => model.error = Some(e),
        },
    }
}

fn init(_: Url, orders: &mut impl Orders<Msg>) -> Model {
    orders.perform_cmd(async { Msg::ToDosReceived(request::get_todos().await) });
    Model::default()
}

#[wasm_bindgen(start)]
pub fn start() {
    App::start("app", init, update, view::view);
}
