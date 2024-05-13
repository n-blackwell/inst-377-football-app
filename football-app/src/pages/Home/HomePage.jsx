import React, { useState, useEffect } from 'react';
import HomeCard from "../../components/MainCard";
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import './HomePage.css'

function HomePage() {
    return (
        <>
            <div className='top-section'>
                <h1>Welcome to the Football App</h1>
            </div>
            <div className="home-card-div">
                <br />
                <Container fluid="sm">
                    <Row>
                        <Col>
                            <HomeCard
                                type="Player"
                                data="Player X scored 3 goals today"
                                link={<Link to="/players">Go To Player</Link>}
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
            <div className='matchup-div'>
                <h2>Matchups</h2>
                <h4>Team X V Team Y</h4>
            </div>
        </>
    )
}

export default HomePage