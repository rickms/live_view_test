import React, {FunctionComponent, useState} from "react";
import {TodoList} from "./TodoList";
import {NewTodoInput} from "./NewTodoInput";
import {RootState} from "../../../store";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {clearTodos} from "../todosSlice";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

import {
    Box,
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Fab,
    Grid
} from "@material-ui/core";

export const Todo:FunctionComponent<any> = () => {
    const dispatch = useAppDispatch();
    const todoCount = useAppSelector( (state:RootState) => state.todos.items.length );
    const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);

    const confirmClearTodoHandler = () => {
        setShowConfirmDeleteDialog(true);
    }

    const clearTodoHandler = () => {
        setShowConfirmDeleteDialog(false);
        dispatch(clearTodos());
    }

    const cancelClearTodoHandler = () => {
        setShowConfirmDeleteDialog(false)
    }

    return (
        <>
        <Box minWidth={"sm"}>
            <Card >
                <Grid container p={2} justifyContent="flex-end" spacing={2}>
                    <Grid item xs={12}>
                        <NewTodoInput/>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider/>
                    </Grid>
                    <Grid item xs={12}>
                        <TodoList/>
                    </Grid>
                    { todoCount > 0 ? <>
                            <Grid item xs={12}>
                                <Divider/>
                            </Grid>
                            <Grid item >
                                <Fab color="secondary" aria-label="delete all" onClick={confirmClearTodoHandler}>
                                    <DeleteForeverIcon />
                                </Fab>
                            </Grid>
                            </>
                        : <></>
                    }
                </Grid>
            </Card>
        </Box>
        <Dialog
            open={showConfirmDeleteDialog}
            onClose={cancelClearTodoHandler}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Clear Todos</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to clear ALL todos?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelClearTodoHandler} color="primary" autoFocus>
                    Cancel
                </Button>
                <Button onClick={clearTodoHandler} color="primary">
                    Clear
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
}