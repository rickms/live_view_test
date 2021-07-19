import React, {FunctionComponent, useEffect, useState} from "react"
import {RootState} from "../../../store";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {clearError, Error} from "../commonSlice";
import {Alert, Snackbar} from "@material-ui/core";

export const Errors:FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const errors = useAppSelector( (state:RootState) => state.common.errors);
    const errorCount = useAppSelector( (state:RootState) => state.common.errors.length);
    const [errorInfo, setErrorInfo] = useState<Error | undefined>(undefined);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // If there's an error, we display it then dispatch an action to clear it from
        // the common errors list.
        if (errorCount > 0 && !errorInfo) {
            setErrorInfo({ ...errors[0]});
            dispatch(clearError(errors[0].id));
            setOpen(true);
        } else if (errorCount > 0 && errorInfo && open) {
            // if there's currently an error being shown and we have a new one, we close the current one first
            setOpen(false);
        }
    },[dispatch, errorCount, errors, errorInfo, open]);

    const closeErrorHandler = (event?: React.SyntheticEvent, reason?: string) => {
        // Disable clicking auto-closing
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    // we don't clear the error info until after the transition animation has finished to prevent
    // the data from being cleared mid-animation.
    const handleExited = () => {
        setErrorInfo(undefined);
    }

    return (
        <Snackbar
            open={open}
            onClose={closeErrorHandler}
            autoHideDuration={6000}
            TransitionProps={{ onExited: handleExited }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right"}}
        >
            <Alert onClose={closeErrorHandler} severity="error" variant="filled">{errorInfo?.description}</Alert>
        </Snackbar>
    )
}