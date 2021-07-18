import {createSlice} from "@reduxjs/toolkit";
import {Todo} from "./model";
import {api, createApiThunk, Method} from "../../api";

type TodoId = number;

export enum TodoAction {
    Idle,
    Loading,
    Adding,
    Clearing,
    Removing,
    Updating
}

interface TodoState {
    currentAction: TodoAction,
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

const initialState = { items: [ ], currentAction: TodoAction.Loading } as TodoState;

export const getTodos = createApiThunk<Todo[],void>('todos/fetchTodos',api("/api/todo"));
export const addTodo = createApiThunk<Todo,CreateRequest>('todos/addTodo', api("/api/todo"), Method.POST );
export const updateTodo = createApiThunk<Todo, UpdateRequest>('todos/updateTodo', api('/api/todo/{id}'), Method.PUT);
export const clearTodos = createApiThunk<ClearResult,void>('todos/clearTodos', api("/api/todo"), Method.DELETE);
export const removeTodo = createApiThunk<RemoveResult,RemoveRequest>('todos/removeTodo', api("/api/todo/{id}"), Method.DELETE);

export const todos = createSlice({
    name: 'todo',
    initialState,
    reducers: {
    },
    extraReducers : builder => {
        builder.addCase(getTodos.pending, (state, action) => {
            state.currentAction = TodoAction.Loading;
        });
        builder.addCase(getTodos.fulfilled, (state, action) => {
            state.currentAction = TodoAction.Idle;
            state.items = action.payload;
        });
        builder.addCase(getTodos.rejected, (state, action) => {
            state.currentAction = TodoAction.Idle;
        });

        builder.addCase(addTodo.pending, (state, action) => {
            state.currentAction = TodoAction.Adding;
        });
        builder.addCase(addTodo.fulfilled, (state, action) => {
            state.currentAction = TodoAction.Idle;
            state.items.push(action.payload)
        });
        builder.addCase(addTodo.rejected, (state, action) => {
            state.currentAction = TodoAction.Idle;
        });

        builder.addCase(updateTodo.pending, (state, action) => {
            state.currentAction = TodoAction.Updating;
        });
        builder.addCase(updateTodo.fulfilled, (state, action) => {
            state.currentAction = TodoAction.Idle;
            let item = state.items.find(i => i.id === action.payload.id);
            if (item) {
                item.description = action.payload.description;
                item.completed = action.payload.completed;
            }
        });
        builder.addCase(updateTodo.rejected, (state, action) => {
            state.currentAction = TodoAction.Idle;
        });

        builder.addCase(clearTodos.pending, (state, action) => {
            state.currentAction = TodoAction.Clearing;
        });
        builder.addCase(clearTodos.fulfilled, (state, action) => {
            state.currentAction = TodoAction.Idle;
            state.items = [];
        });
        builder.addCase(clearTodos.rejected, (state, action) => {
            state.currentAction = TodoAction.Idle;
        });

        builder.addCase(removeTodo.pending, (state, action) => {
            state.currentAction = TodoAction.Removing;
        });
        builder.addCase(removeTodo.fulfilled, (state, action) => {
            state.currentAction = TodoAction.Idle;
            state.items = state.items.filter(i => i.id !== action.payload.id)
        });
        builder.addCase(removeTodo.rejected, (state, action) => {
            state.currentAction = TodoAction.Idle;
        });
    }
});

export default todos.reducer