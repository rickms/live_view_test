import React from 'react';
import './App.css';
import {Header} from "./features/common/components/Header";
import {Main} from "./features/common/components/Main"
import {Col, Container, Row} from "react-bootstrap";

function App() {
  return (
    <div className="App">
        <Container>
            <Row>
                <Col>
                    <Header/>
                </Col>
            </Row>
            <Row>
                <Col className="col-4">
                    <Main/>
                </Col>
            </Row>
        </Container>
    </div>
  );
}

export default App;
