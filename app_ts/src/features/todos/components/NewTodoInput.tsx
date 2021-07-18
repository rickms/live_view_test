import React, {FormEvent, FunctionComponent, useRef, useState} from "react";
import {useAppDispatch, useFormInput} from "../../../hooks";
import {addTodo} from "../todosSlice";
import {Button, Col, Form, Row} from 'react-bootstrap';

export const NewTodoInput:FunctionComponent<any> = () => {
    let dispatch = useAppDispatch();

    const [validated, setValidated] = useState(false);
    let description = useFormInput("", onSubmit);
    const formRef = useRef<HTMLFormElement>(null);

    function onSubmit() {
        console.log(formRef);
        if (formRef?.current?.checkValidity() === true) {
            setValidated(false);
            dispatch(addTodo({description: description.value}));
            console.log("Setting validated to ", validated)
            description.set("");
        }
        setValidated(true);
    }

    return  <div className="row">
                <Form ref={formRef} noValidate validated={validated} onSubmit={(event:FormEvent<HTMLFormElement>) => event.preventDefault() }>
                    <Row>
                       <Col>
                            <Form.Group className="mb-3" controlId="formDescription">
                                <Form.Control type="input" placeholder="New Task Description..." {...description.bind} required />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a todo description.
                                </Form.Control.Feedback>
                            </Form.Group>
                       </Col>
                       <Col className="col-3">
                           <Button variant="primary" type="button" onClick={onSubmit}>Add</Button>
                       </Col>
                    </Row>
                </Form>
            </div>;
}
