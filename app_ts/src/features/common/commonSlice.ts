import {createSlice} from "@reduxjs/toolkit";
import {addTodo, getTodos} from "../todos/todosSlice";

let errorId = 0;

interface Error {
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
        error: (state, action) => {
            state.errors.push({ id: ++errorId, description: action.payload });
        },
        clearError: (state, action) => {
            state.errors = state.errors.filter( error => error.id !== action.payload)
        }
    },
    extraReducers: builder => {
        builder.addCase(getTodos.rejected, (state, action) => {
            state.errors.push({ id: ++errorId, description: "Unable to load Todos" });
        });
        builder.addCase(addTodo.rejected, (state, action) => {
            state.errors.push({ id: ++errorId, description: "Unable to add Todo" });
        });
    }
});


export const { error, clearError } = common.actions;
export default common.reducer