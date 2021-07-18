import React, {FunctionComponent, useEffect} from "react";
import {useAppDispatch} from "../../../hooks";
import {getTodos, TodoAction} from "../todosSlice";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {TodoListItem} from "./TodoListItem";
import {Spinner} from "react-bootstrap";

export const TodoList:FunctionComponent<any> = () => {
    const dispatch = useAppDispatch();
    const items = useSelector((state:RootState) => state.todos.items);
    const currentAction = useSelector( (state:RootState) => state.todos.currentAction);

    useEffect(() => {
        dispatch(getTodos());
    }, [dispatch])

    let list;

    if (currentAction === TodoAction.Loading) {
        list = <div><Spinner animation="border" role="status"/>Loading Tasks...</div>
    } else {
        if (items.length > 0 ) {
            list = <ul className="task-list">{items.map(item => <TodoListItem key={item.id} id={item.id} description={item.description} completed={item.completed}/>)}</ul>
        } else {
            list = <div className="empty-list">No Todos</div>
        }
    }

    return list;
}