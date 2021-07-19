import {Checkbox, IconButton, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close"
import React, {FunctionComponent} from "react";
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

    const CloseButton = <IconButton edge="end" aria-label="close" onClick={onRemove}><CloseIcon /></IconButton>;

    return (
        <ListItem key={props.id} secondaryAction={CloseButton}>
            <ListItemIcon>
            <Checkbox
                edge="start"
                checked={props.completed}
                disableRipple
                onChange={onChange}
            />
            </ListItemIcon>
            <ListItemText primary={props.description} className={props.completed ? "task-completed" : ""} />
        </ListItem>
    )
}