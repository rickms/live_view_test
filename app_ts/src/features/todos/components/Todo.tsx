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
    const todoCount = useSelector( (state:RootState) => state.todos.items.length );

    // button handler
    const onClick = () => dispatch(clearTodos());

    const clearButton = todoCount > 0 ?
        <Row className="row justify-content-end">
            <Col className="col-3 text-end">
                <Button className="btn btn-danger" onClick={onClick}>Clear</Button>
            </Col>
        </Row>
        : <></>

    return  <Container className="tasks">
                <Row className="row">
                    <Col className="col" >
                        <h3>Tasks</h3>
                    </Col>
                </Row>
                <NewTodoInput/>
                <TodoList/>
                {clearButton}
        </Container>;
}