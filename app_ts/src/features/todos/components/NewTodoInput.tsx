import React, {FunctionComponent, useRef, useState} from "react";
import {useAppDispatch, useAppSelector, useFormInput} from "../../../hooks";
import {addTodo, TodoAction} from "../todosSlice";
import {RootState} from "../../../store";
import LoadingButton from '@material-ui/lab/LoadingButton';
import {Grid, TextField} from "@material-ui/core";

export const NewTodoInput:FunctionComponent<any> = () => {
    let dispatch = useAppDispatch();
    const [hasError, setHasError] = useState(false);
    let description = useFormInput("", onSubmit);
    const formRef = useRef<HTMLFormElement>(null);
    const currentAction = useAppSelector( (state:RootState) => state.todos.currentAction);

    function onSubmit() {
        if (formRef?.current?.checkValidity() === true) {
            setHasError(false);
            dispatch(addTodo({description: description.value}));
            description.set("");
        } else {
            setHasError(true);
        }
    }

    return (
        <Grid container spacing={1} justifyContent="center">
            <Grid item xs="auto" >
                <TextField
                    inputRef={formRef}
                    id="standard-basic"
                    variant="outlined"
                    size="small"
                    required
                    helperText="Enter task description"
                    error={hasError}
                    {...description.bind}/>
            </Grid>
            <Grid item xs="auto" >
                <LoadingButton
                    onClick={onSubmit}
                    loading={currentAction === TodoAction.Adding}
                    variant="contained"
                >
                    Add
                </LoadingButton>
            </Grid>
        </Grid>
    );
}
