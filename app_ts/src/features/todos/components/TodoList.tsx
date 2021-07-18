import React, {FunctionComponent, useEffect} from "react";
import {useAppDispatch} from "../../../hooks";
import {getTodos} from "../todosSlice";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {TodoListItem} from "./TodoListItem";

export const TodoList:FunctionComponent<any> = () => {
    const dispatch = useAppDispatch();
    const items = useSelector((state:RootState) => state.todos.items);

    useEffect(() => {
        dispatch(getTodos());
    }, [dispatch])

    const list = items.map( item => <TodoListItem key={item.id} id={item.id} description={item.description} completed={item.completed} />);

    return <ul className="list-group">{list}</ul>;
}