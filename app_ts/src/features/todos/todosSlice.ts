import {createSlice} from "@reduxjs/toolkit";
import {Todo} from "./model";
import {api, createApiThunk, Method} from "../../api";

type TodoId = number;

interface TodoState {
    error: string;
    items:Todo[]
}

interface CreateRequest {
    description:string
}

interface UpdateRequest {
    id: TodoId,
    description?: string,
    completed?: boolean
}

interface RemoveRequest {
    id: TodoId
}

interface ClearResult {
    total: TodoId
}

interface RemoveResult {
    id: TodoId;
}

const initialState = { error: "", items: [ ] } as TodoState;

export const getTodos = createApiThunk<Todo[],void>('todos/fetchTodos',api("/api/todo"));
export const addTodo = createApiThunk<Todo,CreateRequest>('todos/addTodo', api("/api/todo"), Method.POST );
export const updateTodo = createApiThunk<Todo, UpdateRequest>('todos/updateTodo', api('/api/todo/{id}'), Method.PUT);
export const clearTodos = createApiThunk<ClearResult,void>('todos/clearTodos', api("/api/todo"), Method.DELETE);
export const removeTodo = createApiThunk<RemoveResult,RemoveRequest>('todos/removeTodo', api("/api/todo/{id}"), Method.DELETE);

export const todos = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        error: (state, action) => {
            state.error = action.payload;
        }
    },
    extraReducers : builder => {
        builder.addCase(getTodos.fulfilled, (state, action) => {
            state.items = action.payload;
        });
        builder.addCase(getTodos.rejected, (state, action) => {
            state.error = "Unable to load Todos"
        });
        builder.addCase(addTodo.fulfilled, (state, action) => {
            state.items.push(action.payload)
        });
        builder.addCase(addTodo.rejected, (state, action) => {
            state.error = "Unable to add Todo"
        });
        builder.addCase(updateTodo.fulfilled, (state, action) => {
            let item = state.items.find(i => i.id === action.payload.id);
            if (item) {
                item.description = action.payload.description;
                item.completed = action.payload.completed;
            }
        });
        builder.addCase(updateTodo.rejected, (state, action) => {
            state.error = "Unable to update Todo"
        });
        builder.addCase(clearTodos.fulfilled, (state, action) => {
            state.items = [];
        });
        builder.addCase(clearTodos.rejected, (state, action) => {
            state.error = "Unable to clear Todos"
        });
        builder.addCase(removeTodo.fulfilled, (state, action) => {
            state.items = state.items.filter(i => i.id !== action.payload.id)
        });
        builder.addCase(removeTodo.rejected, (state, action) => {
            state.error = "Unable to remove Todo"
        });
    }
});


export const { error } = todos.actions;
export default todos.reducer