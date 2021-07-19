import React, {FunctionComponent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {getTodos, TodoAction} from "../todosSlice";
import {RootState} from "../../../store";
import {TodoListItem} from "./TodoListItem";
import {List, Skeleton} from "@material-ui/core";

export const TodoList:FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const items = useAppSelector((state: RootState) => state.todos.items);
    const currentAction = useAppSelector((state: RootState) => state.todos.currentAction);

    useEffect(() => {
        dispatch(getTodos());
    }, [dispatch])

    // Either show a The todos list, the "No Todos" message or a loading skeleton, depending on the state of things.
    let list;
    if (currentAction === TodoAction.Loading) {
        list = <Skeleton variant="rectangular" width="100%" />;
    } else {
        if (items.length > 0) {
            list = <List disablePadding>{items.map(item => <TodoListItem key={item.id} id={item.id} description={item.description}
                                                          completed={item.completed}/>)}</List>
        } else {
            list = <div className="empty-list">No Todos</div>
        }
    }

    return list;
}