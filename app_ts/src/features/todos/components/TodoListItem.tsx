import React, {FunctionComponent} from "react";
import {Button} from "react-bootstrap";
import {useAppDispatch} from "../../../hooks";
import {removeTodo, updateTodo} from "../todosSlice";

interface TodoListItemProps {
    id: number,
    description: string,
    completed:boolean,
}

export const TodoListItem:FunctionComponent<TodoListItemProps> = (props) => {
    let dispatch = useAppDispatch();

    const onChange = () => dispatch(updateTodo({ id: props.id, completed: !props.completed}));
    const onRemove = () => dispatch(removeTodo( { id: props.id }));

    return <li className="list-group-item d-flex justify-content-between align-items-start">
        <input className="checkbox form-check-input" type="checkbox" checked={props.completed} onChange={onChange}/>
        <div className={"ms-2 me-auto " + (props.completed ? 'task-completed' : "")}>{props.description}</div>
        <Button className="btn-close btn-close-custom" onClick={onRemove}/>
    </li>;
}