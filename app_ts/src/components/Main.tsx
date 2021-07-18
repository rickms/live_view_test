import React, {FunctionComponent} from "react"
import {Todo} from "../features/todos/components/Todo";
import {Col, Container, Row} from "react-bootstrap";

export const Main:FunctionComponent<any> = () => {
    return <Container><Row><Col className="col-4"><Todo/></Col></Row></Container>
}