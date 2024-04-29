import React, { useState, useEffect } from 'react';
import HomeCard from "../../components/MainCard";
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';

function HomePage() {
    return (
        <>
            <div className="home-card-div">
                <br />
                <Container fluid="sm">
                    <Row>
                        <Col>
                            <HomeCard
                                type="Player"
                                data="Player X scored 3 goals today"
                                link="Got to Player"
                            />
                        </Col>
                        <Col>
                            <HomeCard />
                        </Col>
                        <Col>
                            <HomeCard />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default HomePage