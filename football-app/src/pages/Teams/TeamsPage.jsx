import React from "react"
import Table from 'react-bootstrap/Table';
import './TeamsPage.css'
import { useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";

function PlayerData({ playersRes }) {
    return (
        <>
            {
                playersRes.map((curPlayer) => {
                    const { number, name, position } = curPlayer
                    return (
                        <tr key={number}>
                            <td>{number}</td>
                            <td>{name}</td>
                            <td>{position}</td>
                        </tr>
                    )
                })
            }
        </>
    )
}

function TeamsPage() {
    const apiKey = '10755b2a08msh15dff173eafe850p158f43jsnf3d99db20514'
    const url = "https://api-football-v1.p.rapidapi.com/v3/players/squads?team=33"
    const [players, setPlayers] = useState([])

    const fetchPlayers = async (url) => {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '10755b2a08msh15dff173eafe850p158f43jsnf3d99db20514',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        })
        let data = await res.json()
        data = data['response'][0]['players']
        setPlayers(data)
    }

    useEffect(() => {
        // fetchPlayers(url)
    }, [])

    return (
        <>
            <h1>Teams Page</h1>
            <div className="roster-table">
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Position</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <PlayerData playersRes={players} /> */}
                    </tbody>
                </Table>
            </div>
            <div className="team-info-table">
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Home</th>
                            <th>Away</th>
                            <th>All</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <TeamData teamRes={team} /> */}
                        <tr>
                            <td>Games Played</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Wins</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Draws</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Losses</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colSpan={4}><strong>Goals</strong></td>
                        </tr>
                        <tr>
                            <td>Goals For</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Goals Against</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colSpan={4}><strong>Average Goals</strong></td>
                        </tr>
                        <tr>
                            <td>Goals For</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Goals Against</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </>
    )
}

export default TeamsPage

// Team info will be procured from the database. The server will get it from the database.
// If the database does not have team info or if the team info is older than a day old, the server will
// Make the API call to API Football, store it to the database, and then pass it to the client.