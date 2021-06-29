use serde_derive::*;
use std::sync::RwLock;
use thiserror::Error;
use todo_common::{ToDoId, UpdateRequest};

pub type AppState = RwLock<State>;

#[derive(Error, Debug)]
pub enum StateChangeError {
    #[error("ToDo {0} not found")]
    ToDoNotFound(ToDoId)
}

#[derive(Serialize, Debug)]
pub struct State {
    last_todo_id: ToDoId,
    todo_items: Vec<ToDo>,
}

#[derive(Serialize, Debug, Clone)]
pub struct ToDo {
    pub id: ToDoId,
    pub description: String,
    pub completed: bool
}

impl ToDo {
    fn new(id: ToDoId, description: &str) -> ToDo {
        ToDo { id, description: description.to_owned(), completed: false }
    }
}

impl State {
    fn new() -> State {
        State {
            last_todo_id: 0,
            todo_items: Vec::new()
        }
    }
    pub fn add_todo_item(&mut self, description:&str) -> Result<ToDo,StateChangeError> {
        // Simple id tracking for this test. Production environment id tracking would be more complex.
        self.last_todo_id = self.last_todo_id.wrapping_add( 1);
        let id = self.last_todo_id;

        let new_todo = ToDo::new(id, description);
        self.todo_items.push(new_todo.clone());
        Ok(new_todo)
    }

    pub fn remove_todo_item(&mut self, id:ToDoId) -> Result<ToDoId, StateChangeError> {
        self.todo_items.remove(
            self.todo_items.iter().position(|todo| todo.id == id).ok_or(StateChangeError::ToDoNotFound(id))?
        );

        Ok(id)
    }

    pub fn clear_todo_items(&mut self) -> Result<usize, StateChangeError> {
        let total = self.todo_items.len();
        self.todo_items.clear();
        Ok(total)
    }

    pub fn todo_items(&self) -> &[ToDo] {
        self.todo_items.as_slice()
    }

    pub fn update_todo(&mut self, id:ToDoId, update:UpdateRequest) -> Result<ToDo, StateChangeError> {
        let item = self.todo_items.iter_mut().find(|todo| todo.id == id).ok_or(StateChangeError::ToDoNotFound(id))?;

        if update.description.is_some() {
            item.description = update.description.unwrap(); // unwrap OK here because of is_some check.
        }

        if update.completed.is_some() {
            item.completed = update.completed.unwrap(); // unwrap OK here because of is_some check
        }

        Ok(item.clone())
    }
}

impl Default for State {
    fn default() -> State {
        State::new()
    }
}