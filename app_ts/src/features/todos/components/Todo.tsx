import React, {FunctionComponent} from "react";
import {TodoList} from "./TodoList";
import {NewTodoInput} from "./NewTodoInput";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {Button, Col, Container, Row} from "react-bootstrap";
import {useAppDispatch} from "../../../hooks";
import {clearTodos} from "../todosSlice";

export const Todo:FunctionComponent<any> = () => {
    const dispatch = useAppDispatch();
    const error = useSelector( (state:RootState) => state.todos.error )

    let error_component = error ? <div className="row"><div className="alert alert-danger">{error}</div></div> : <></>;

    const onClick = () => dispatch(clearTodos());

    return  <Container className="tasks">
                <Row className="row">
                    <Col className="col" >
                        <h3>Tasks</h3>
                    </Col>
                </Row>
                {error_component}
                <NewTodoInput/>
                <TodoList/>
                <br/>
                <Row className="row">
                    <Col className="col">
                        <Button className="btn btn-danger float-end" onClick={onClick}>Clear</Button>
                    </Col>
                </Row>
    </Container>;
}