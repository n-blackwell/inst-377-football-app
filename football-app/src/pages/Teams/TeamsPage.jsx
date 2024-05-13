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
    const playerUrl = "https://api-football-v1.p.rapidapi.com/v3/players/squads?team=33"
    const statsUrl = "http://localhost:9000/team/info?teamID=33&LeagueID=39"

    const [players, setPlayers] = useState([])
    const [stats, setStats] = useState([])

    const fetchPlayers = async (playerUrl) => {
        const res = await fetch(playerUrl, {
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

    const fetchTeamStats = async (statsUrl) => {
        const res = await fetch(statsUrl)
        const data = await res.json()
        setStats(data[0])
        console.log(data)
    }

    useEffect(() => {
        // fetchPlayers(playerUrl)
        fetchTeamStats(statsUrl)
    }, [])

    return (
        <>
            <h1 style={{ marginLeft: 10 }}>Teams Page</h1>
            <div className="roster-table">
                <span><strong>Roster</strong></span>
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Position</th>
                        </tr>
                    </thead>
                    <tbody>
                        <PlayerData playersRes={players} />
                    </tbody>
                </Table>
            </div>
            <div className="team-info-table">
                <span><strong>Stats</strong></span>
                <Table striped bordered >
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Home</th>
                            <th>Away</th>
                            <th>All</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Games Played</td>
                            <td>{stats['home_games']}</td>
                            <td>{stats['away_games']}</td>
                            <td>{stats['total_games']}</td>
                        </tr>
                        <tr>
                            <td>Wins</td>
                            <td>{stats['home_wins']}</td>
                            <td>{stats['away_wins']}</td>
                            <td>{stats['total_wins']}</td>
                        </tr>
                        <tr>
                            <td>Draws</td>
                            <td>{stats['home_draws']}</td>
                            <td>{stats['away_draws']}</td>
                            <td>{stats['total_draws']}</td>
                        </tr>
                        <tr>
                            <td>Losses</td>
                            <td>{stats['home_losses']}</td>
                            <td>{stats['away_losses']}</td>
                            <td>{stats['total_losses']}</td>
                        </tr>
                        <tr>
                            <td colSpan={4}><strong>Goals</strong></td>
                        </tr>
                        <tr>
                            <td>Goals For</td>
                            <td>{stats['for_home_goals']}</td>
                            <td>{stats['for_away_goals']}</td>
                            <td>{stats['for_total_goals']}</td>
                        </tr>
                        <tr>
                            <td>Goals Against</td>
                            <td>{stats['against_home_goals']}</td>
                            <td>{stats['against_home_goals']}</td>
                            <td>{stats['against_home_goals']}</td>
                        </tr>
                        <tr>
                            <td colSpan={4}><strong>Average Goals</strong></td>
                        </tr>
                        <tr>
                            <td>Goals For</td>
                            <td>{(stats['for_home_goals'] / stats['total_games']).toFixed(2)}</td>
                            <td>{(stats['for_away_goals'] / stats['total_games']).toFixed(2)}</td>
                            <td>{(stats['for_total_goals'] / stats['total_games']).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Goals Against</td>
                            <td>{(stats['against_away_goals'] / stats['total_games']).toFixed(2)}</td>
                            <td>{(stats['against_away_goals'] / stats['total_games']).toFixed(2)}</td>
                            <td>{(stats['against_total_goals'] / stats['total_games']).toFixed(2)}</td>
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