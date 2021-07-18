import React from 'react';
import './App.css';
import {Header} from "./components/Header";
import {Main} from "./components/Main"
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
                <Col>
                    <Main/>
                </Col>
            </Row>
        </Container>
    </div>
  );
}

export default App;
