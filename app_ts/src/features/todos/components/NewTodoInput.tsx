import React, {FunctionComponent, useState, KeyboardEvent} from "react";
import {useAppDispatch, useFormInput} from "../../hooks";
import {addTodo} from "../../features/todos/todosSlice";
import { Button } from 'react-bootstrap';

export const NewTodoInput:FunctionComponent<any> = () => {
    let description = useFormInput("", onEnter);
    let dispatch = useAppDispatch();

    // We use function syntax here because it will be hoisted allowing us to keep hooks at the top.
    function onEnter() {
        console.log("Submitting... ", description.value);
        dispatch(addTodo({ description: description.value }));
    }

    return <div>
        <input className="form-control" type="text" id="task_description" placeholder="New Task Description..." required={true} {...description.bind} />
        <Button className="btn btn-primary float-end" onClick={onEnter}>Add</Button>
    </div>;
}
