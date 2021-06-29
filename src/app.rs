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
    todos: Vec<ToDo>,
}

#[derive(Serialize, Debug, Clone, PartialEq)]
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
            todos: Vec::new()
        }
    }
    pub fn add_todo(&mut self, description:&str) -> Result<ToDo,StateChangeError> {
        // Simple id tracking for this test. Production environment id tracking would be more complex.
        self.last_todo_id = self.last_todo_id.wrapping_add( 1);
        let id = self.last_todo_id;

        let new_todo = ToDo::new(id, description);
        self.todos.push(new_todo.clone());
        Ok(new_todo)
    }

    pub fn remove_todo(&mut self, id:ToDoId) -> Result<ToDoId, StateChangeError> {
        self.todos.remove(
            self.todos.iter().position(|todo| todo.id == id).ok_or(StateChangeError::ToDoNotFound(id))?
        );

        Ok(id)
    }

    pub fn clear_todos(&mut self) -> Result<usize, StateChangeError> {
        let total = self.todos.len();
        self.todos.clear();
        Ok(total)
    }

    pub fn todos(&self) -> &[ToDo] {
        self.todos.as_slice()
    }

    pub fn update_todo(&mut self, id:ToDoId, update:UpdateRequest) -> Result<ToDo, StateChangeError> {
        let item = self.todos.iter_mut().find(|todo| todo.id == id).ok_or(StateChangeError::ToDoNotFound(id))?;

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

#[cfg(test)]
mod tests {
    use crate::app::{State, ToDo};
    use todo_common::UpdateRequest;

    #[test]
    fn add_todo() {
        let mut state = State::new();
        let _ = state.add_todo("test");
        assert_eq!(state.todos, vec![ToDo { id: 1, description: "test".to_owned(), completed: false}] );
    }
    #[test]
    fn remove_todo() {
        let mut state = State::new();
        let _ = state.add_todo("test1");
        let _ = state.add_todo("test2");
        let _ = state.add_todo("test3");
        let _ = state.remove_todo(2);
        assert_eq!(state.todos, vec![ToDo { id: 1, description: "test1".to_owned(), completed: false}, ToDo { id: 3, description: "test3".to_owned(), completed: false}] );
    }

    #[test]
    fn clear_todo() {
        let mut state = State::new();
        let _ = state.add_todo("test1");
        let _ = state.add_todo("test2");
        let _ = state.add_todo("test3");
        let _ = state.clear_todos();
        assert_eq!(state.todos, vec![] );
    }

    #[test]
    fn update_todo() {
        let mut state = State::new();
        let _ = state.add_todo("test");
        let _ = state.update_todo(1, UpdateRequest { description: None, completed:Some(true) });
        assert_eq!(state.todos, vec![ToDo { id: 1, description: "test".to_owned(), completed: true}] );
    }
}