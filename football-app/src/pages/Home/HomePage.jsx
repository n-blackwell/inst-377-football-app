import React, { useState, useEffect } from 'react';
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup';
import './HomePage.css'

function HomePage() {
    const [fixtureCount, setFixtureCount] = useState(2)
    const [fixtureData, setFixtureData] = useState({})
    const [maxFixtureCount, setMaxFixtureCount] = useState(9999999)
    const [isLoading, setIsLoading] = useState(true)

    const today = formatDate(new Date())
    const fixtureUrl = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${today}`

    const fetchFixtures = async (fixtureUrl) => {
        console.log('Fetching')
        const res = await fetch(fixtureUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '2fef88074dmsh152cc0bbbaae36cp19843cjsn22175ba2aeef',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        })
        let data = await res.json()
        data = data['response']
        setFixtureData(data)
        setMaxFixtureCount(Object.keys(fixtureData).length)
        setIsLoading(false)
    }

    useEffect(() => {
        setFixtureCount(2)
        fetchFixtures(fixtureUrl)
    }, [])

    useEffect(() => {
        const interval1 = setInterval(() => setFixtureCount((fixtureCount === maxFixtureCount) ? 0 : fixtureCount + 3), 10000);

        return () => {
            clearInterval(interval1);
        };
    }, [fixtureCount, maxFixtureCount]);

    return (
        <>
            <div className='top-section'>
                <h1>Welcome to the Football App</h1>
            </div>
            <div className="fixtures">
                <br />
                <Container fluid="sm">
                    <Row>
                        <Col>
                            <HomeCard
                                fixtureData={fixtureData}
                                fixtureCount={fixtureCount}
                                isLoading={isLoading}
                            />
                        </Col>
                        <Col>
                            <HomeCard
                                fixtureData={fixtureData}
                                fixtureCount={fixtureCount + -1}
                                isLoading={isLoading}
                            />
                        </Col>
                        <Col>
                            <HomeCard
                                fixtureData={fixtureData}
                                fixtureCount={fixtureCount + -2}
                                isLoading={isLoading}
                            />
                        </Col>
                    </Row>
                </Container>
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

function HomeCard({ fixtureData, fixtureCount, isLoading }) {
    if (isLoading) {
        return
    }

    const homeName = fixtureData[fixtureCount]['teams']['home']['name']
    const awayName = fixtureData[fixtureCount]['teams']['away']['name']
    const homeGoals = (fixtureData[fixtureCount]['goals']['home'] != null) ? fixtureData[fixtureCount]['goals']['home'] : '-'
    const awayGoals = (fixtureData[fixtureCount]['goals']['away'] != null) ? fixtureData[fixtureCount]['goals']['away'] : '-'
    const homeLogo = fixtureData[fixtureCount]['teams']['home']['logo']
    const awayLogo = fixtureData[fixtureCount]['teams']['away']['logo']
    let city = ''
    let stadium = ''
    if ((fixtureData[fixtureCount]['fixture']['venue']['name'] || fixtureData[fixtureCount]['fixture']['venue']['city']) != null) {
        stadium = fixtureData[fixtureCount]['fixture']['venue']['name']
        city = fixtureData[fixtureCount]['fixture']['venue']['city']
    } else {
        stadium = 'TBD'
    }
    const matchStatus = fixtureData[fixtureCount]['fixture']['status']['short']
    const elapsed = (fixtureData[fixtureCount]['fixture']['status']['elapsed'] != null) ? fixtureData[fixtureCount]['fixture']['status']['elapsed'] : '-'


    return (
        <Card className="home-cards" style={{ maxWidth: 'fit-content' }}>
            <Card.Img variant="top" height="382px" width="382px" src={(homeGoals > awayGoals) ? homeLogo : awayLogo} />
            <Card.Header>{homeName} vs {awayName}</Card.Header>
            <Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item className='home-card-score'>{"Score:\n" + homeName + ": " + homeGoals} | {awayName + ": " + awayGoals}</ListGroup.Item>
                    <ListGroup.Item>{"\n" + matchStatus + ":" + elapsed}</ListGroup.Item>
                    <Card.Title>{stadium + "\n"} {city}</Card.Title>
                </ListGroup>
            </Card.Body>
        </Card>
    );
}

export default HomePage