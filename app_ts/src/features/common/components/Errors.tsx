import React, {FunctionComponent} from "react"
import {Toast, ToastContainer} from "react-bootstrap";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useAppDispatch} from "../../../hooks";
import {clearError} from "../commonSlice";
import {BsFillExclamationTriangleFill} from "react-icons/bs";

export const Errors:FunctionComponent<any> = () => {
    const dispatch = useAppDispatch();
    const errors = useSelector( (state:RootState) => state.common.errors);

    let currentErrors = [...errors];
    const toasts = currentErrors.reverse().map( error => {
        return <Toast className="error-toast" key={error.id} autohide={true} delay={6000} onClose={() => dispatch(clearError(error.id))}>
                    <Toast.Header>
                        <BsFillExclamationTriangleFill color="red" size="2em" className="error-toast-icon"/>
                        <strong className="me-auto">Error</strong>
                    </Toast.Header>
                    <Toast.Body>{ error.description }</Toast.Body>
                </Toast>
    });

    return  <ToastContainer position="bottom-end">
    {toasts}
    </ToastContainer>
}