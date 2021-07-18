import React, {FunctionComponent} from "react";

interface TodoListItemProps {
    id: number,
    description: string,
    completed:boolean,
}

export const TodoListItem:FunctionComponent<TodoListItemProps> = (props) => <div>{props.id} {props.description} {props.completed}</div>;