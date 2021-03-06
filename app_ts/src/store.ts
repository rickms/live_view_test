import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'
import todoReducer from "./features/todos/todosSlice";
import commonReducer from "./features/common/commonSlice"

export const store = configureStore({
    reducer: {
        common: commonReducer,
        todos: todoReducer
    },
    middleware: getDefaultMiddleware(), // includes thunk
    devTools: true
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch