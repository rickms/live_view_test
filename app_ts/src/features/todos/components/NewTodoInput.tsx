import React, {FormEvent, FunctionComponent, useRef, useState} from "react";
import {useAppDispatch, useFormInput} from "../../../hooks";
import {addTodo, TodoAction} from "../todosSlice";
import {Button, Col, Form, Row, Spinner} from 'react-bootstrap';
import {useSelector} from "react-redux";
import {RootState} from "../../../store";

export const NewTodoInput:FunctionComponent<any> = () => {
    let dispatch = useAppDispatch();

    const [validated, setValidated] = useState(false);
    let description = useFormInput("", onSubmit);
    const formRef = useRef<HTMLFormElement>(null);
    const currentAction = useSelector( (state:RootState) => state.todos.currentAction);

    function onSubmit() {
        if (formRef?.current?.checkValidity() === true) {
            setValidated(false);
            dispatch(addTodo({description: description.value}));
            description.set("");
        } else {
            setValidated(true);
        }
    }

    const submitButton = currentAction === TodoAction.Adding ?
        <Button variant="primary" disabled>
            <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            />
            <span className="visually-hidden">Loading...</span>
        </Button> :
        <Button variant="primary" type="button" onClick={onSubmit}>Add</Button>;



    return <Form ref={formRef} noValidate validated={validated} onSubmit={(event:FormEvent<HTMLFormElement>) => event.preventDefault() }>
                    <Row>
                       <Col>
                            <Form.Group className="mb-3" controlId="formDescription">
                                <Form.Control type="input" placeholder="New Task Description..." {...description.bind} required />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a todo description.
                                </Form.Control.Feedback>
                            </Form.Group>
                       </Col>
                       <Col className="col-3 text-end">
                           {submitButton}
                       </Col>
                    </Row>
                </Form>
}
