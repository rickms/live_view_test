import {createSlice} from "@reduxjs/toolkit";
import {addTodo, clearTodos, getTodos, removeTodo, updateTodo} from "../todos/todosSlice";

let errorId = 0;

export interface Error {
    id: number,
    description: string
}

interface CommonState {
    errors: Error[]
}

const initialState = { errors: [] } as CommonState;

export const common = createSlice({
    name: 'common',
    initialState,
    reducers: {
        clearError: (state, action) => {
            state.errors = state.errors.filter( error => error.id !== action.payload)
        }
    },
    // Here we hook into the reducers associated with the rejection of todo api request promises,
    // allowing us to display an error message to the user.
    extraReducers: builder => {
        builder.addCase(getTodos.rejected, (state) => {
            state.errors.push({ id: ++errorId, description: "Unable to load Todos" });
        });
        builder.addCase(addTodo.rejected, (state) => {
            state.errors.push({ id: ++errorId, description: "Unable to add Todo" });
        });
        builder.addCase(removeTodo.rejected, (state) => {
            state.errors.push({ id: ++errorId, description: "Unable to remove Todo" });
        });
        builder.addCase(clearTodos.rejected, (state) => {
            state.errors.push({ id: ++errorId, description: "Unable to clear Todos" });
        });
        builder.addCase(updateTodo.rejected, (state) => {
            state.errors.push({ id: ++errorId, description: "Unable to update Todos" });
        });
    }
});

export const { clearError } = common.actions;
export default common.reducer