import React, { useState, useEffect, useMemo } from 'react';
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'
import './HomePage.css'

function HomePage() {
    const [fixtureCount, setFixtureCount] = useState(0)
    const [fixtureData, setFixtureData] = useState({})
    const [maxFixtureCount, setMaxFixtureCount] = (useState(9999999))

    const today = formatDate(new Date)
    const fixtureUrl = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${today}`

    const fetchFixtures = async (fixtureUrl) => {
        const res = await fetch(fixtureUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '10755b2a08msh15dff173eafe850p158f43jsnf3d99db20514',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        })
        let data = await res.json()
        console.log("response data ", data)
        data = data['response']
        setFixtureData(data)
        setMaxFixtureCount(Object.keys(fixtureData).length)
    }

    useEffect(() => {
        setFixtureCount(0)
        fetchFixtures(fixtureUrl)
    }, [])

    useEffect(() => {
        const interval1 = setInterval(() => setFixtureCount((fixtureCount === maxFixtureCount) ? 0 : fixtureCount + 1), 10000);

        return () => {
            clearInterval(interval1);
        };
    }, [fixtureCount]);

    return (
        <>
            <h1>{fixtureCount}</h1>
            <div className='top-section'>
                <h1>Welcome to the Football App</h1>
            </div>
            <div className="home-card-div">
                <br />
                <Container fluid="sm">
                    <Row>
                        <Col>
                            {/* <HomeCard
                                fixtureData={fixtureData}
                                fixtureCount={fixtureCount}
                            /> */}
                        </Col>
                        <Col>
                            {/* <HomeCard /> */}
                        </Col>
                        <Col>
                            {/* <HomeCard /> */}
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

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function HomeCard(fixtureData, fixtureCount) {


    const limiter = Math.floor(fixtureCount / 100)
    console.log("limiter: ", limiter, "limitedFixtureData: ", fixtureData[limiter])

    const homeName = fixtureData[fixtureCount][limiter]['teams']['home']['name']
    const awayName = fixtureData[fixtureCount][limiter]['teams']['away']['name']
    const homeGoals = fixtureData[fixtureCount][limiter]['goals']['home']
    const awayGoals = fixtureData[fixtureCount][limiter]['goals']['home']
    const homeLogo = fixtureData[fixtureCount][limiter]['teams']['home']['logo']
    const awayLogo = fixtureData[fixtureCount][limiter]['teams']['home']['logo']
    const stadium = fixtureData[fixtureCount][limiter]['fixture']['venue']['name']
    const city = fixtureData[fixtureCount][limiter]['fixture']['venue']['city']
    const matchStatus = fixtureData[fixtureCount][limiter]['fixture']['status']['short']
    const elapsed = fixtureData[fixtureCount][limiter]['fixture']['staus']['elapsed']


    return (
        <Card style={{ width: '24rem' }}>
            <Card.Img variant="top" src={(homeGoals > awayGoals) ? homeLogo : awayLogo} />
            <Card.Header>{homeName} vs {awayName}</Card.Header>
            <Card.Body>
                <Card.Title>Score: {homeName + ": " + homeGoals} | {awayName + ": " + awayGoals} || {matchStatus + ":" + elapsed}</Card.Title>
                <Card.Text>
                    {stadium} | {city}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default HomePage