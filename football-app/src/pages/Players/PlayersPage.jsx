import React from "react"
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useEffect, useState } from "react";
import './PlayersPage.css'

function PlayersPage() {
    const [slideCount1, setSlideCount1] = useState(2);
    const [slideCount2, setSlideCount2] = useState(2);
    const [playerData1, setPlayerData1] = useState({})
    const [playerData2, setPlayerData2] = useState({})
    const playerUrl = ''
    const testPlayerData = {
        name: "Test Player",
        position: "Forward",
        age: "33",
        nationality: "American",
        team: "Real Madrid",
        total_shots: 132,
        shots_on_goal: 94,
        total_goals: 14,
        goal_assists: 15

    }

    useEffect(() => {
        const interval1 = setInterval(() => setSlideCount1((slideCount1 == 2) ? 0 : slideCount1 + 1), 3000);
        const interval2 = setInterval(() => setSlideCount2((slideCount2 == 2) ? 0 : slideCount2 + 1), 3000);

        return () => {
            clearInterval(interval1);
            clearInterval(interval2);
        };
    }, [slideCount1, slideCount2]);

    const updateCardData = () => {

    }
    const fetchPlayerInfo = async (playerUrl) => {
        const res = await fetch(playerUrl)
        const data = await res.json()
        setPlayerData1(data[0][0])
        setPlayerData2(data[0][1])
        console.log(data)
    }

    return (
        <>
            <h1>Players Page</h1>
            <br />
            <h1>{[slideCount1, slideCount2]}</h1>
            <div className="left-player">
                <PlayerCard
                    slideCount={slideCount1}
                    setSlideCount={setSlideCount1}
                    playerData={testPlayerData}
                />
            </div>
            <div className="right-player">
                <PlayerCard
                    slideCount={slideCount2}
                    setSlideCount={setSlideCount2}
                    playerData={testPlayerData}
                />
            </div>
        </>
    )
}

function PlayerCard({ slideCount, setSlideCount, playerData }) {
    const slideController = (slideCount) => {
        if (slideCount == 0) {
            return ["Nationality: " + playerData.nationality, "Team: " + playerData.team]
        } else if (slideCount == 1) {
            return ["Total Goals: " + playerData["total_goals"], "Goal Assists: " + playerData["goal_assists"]]
        } else {
            return ["Total Shots: " + playerData["total_shots"], "Shots on Goal: " + playerData["shots_on_goal"]]
        }
    }

    return (
        <Card style={{ width: '24rem' }}>
            <Card.Img variant="top" src={playerData.image} />
            <Card.Body>
                <Card.Title>{playerData.name}</Card.Title>
                <Card.Text>
                    {playerData.position} | {playerData.age}
                </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroup.Item>{slideController(slideCount)[0]}</ListGroup.Item>
                <ListGroup.Item>{slideController(slideCount)[1]}</ListGroup.Item>
                <ListGroup.Item>
                    <ul className="control-dots">
                        <li onClick={() => setSlideCount(0)} className={slideCount == 0 ? "control-dot black" : "control-dot"}></li>
                        <li onClick={() => setSlideCount(1)} className={slideCount == 1 ? "control-dot black" : "control-dot"}></li>
                        <li onClick={() => setSlideCount(2)} className={slideCount == 2 ? "control-dot black" : "control-dot"}></li>
                    </ul>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    )
}

export default PlayersPage