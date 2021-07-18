import React, {FunctionComponent, useEffect} from "react";
import {useAppDispatch} from "../../hooks";
import {fetchTodos} from "../../features/todos/todosSlice";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {TodoListItem} from "./TodoListItem";

export const TodoList:FunctionComponent<any> = () => {
    const dispatch = useAppDispatch();
    const items = useSelector((state:RootState) => state.todos.items);

    useEffect(() => {
        dispatch(fetchTodos());
    }, [])

    const list = items.map( e => <TodoListItem key={e.id} id={e.id} description={e.description} completed={e.completed} />);

    return <div>{list}</div>;
}