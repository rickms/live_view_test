import React, {FunctionComponent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {getTodos, TodoAction} from "../todosSlice";
import {RootState} from "../../../store";
import {TodoListItem} from "./TodoListItem";
import {Col, Row, Spinner} from "react-bootstrap";

export const TodoList:FunctionComponent<any> = () => {
    const dispatch = useAppDispatch();
    const items = useAppSelector((state:RootState) => state.todos.items);
    const currentAction = useAppSelector( (state:RootState) => state.todos.currentAction);

    useEffect(() => {
        dispatch(getTodos());
    }, [dispatch])

    // Either show a The todos list, the "No Todos" message or a loading spinner, depending on the state of things.
    let list;
    if (currentAction === TodoAction.Loading) {
        list = <Spinner animation="border" role="status" variant="primary"/>
    } else {
        if (items.length > 0 ) {
            list = <ul className="task-list">{items.map(item => <TodoListItem key={item.id} id={item.id} description={item.description} completed={item.completed}/>)}</ul>
        } else {
            list = <div className="empty-list">No Todos</div>
        }
    }

    return <Row><Col className="text-center">{list}</Col></Row>
}