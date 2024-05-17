const express = require("express")
const supabaseClient = require("@supabase/supabase-js")
const bodyParser = require("body-parser")
const path = require('path');

// To run server + front end seperately:
// - Make sure Line 18 [app.use(express.static(path.join(__dirname, './client/build')));] is commented out
// - Make sure Line 20 [app.use(express.static(__dirname + '/public'))] is uncommented

//To run server + front end together
// Make sure Line 18 [app.use(express.static(path.join(__dirname, './client/build')));] is uncommented 
// Make sure Line 20 [app.use(express.static(__dirname + '/public'))] is commented out

const app = express()
const port = 9000
app.use(bodyParser.json())
// Serves the front end using the server
app.use(express.static(path.join(__dirname, './client/build')));
// Runs the server and front-end on seperate local hosts
// app.use(express.static(__dirname + '/public'))

const supabaseURL = 'https://qrsyjpzbwskvprkogtxa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyc3lqcHpid3NrdnBya29ndHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MTc3MTEsImV4cCI6MjAzMTE5MzcxMX0.AWplzUF32KSVE69nR13qcOiAiDedtelHlSdbW4nGLOg'

// Creates connection to database
const supabase = supabaseClient.createClient(supabaseURL, supabaseKey)

//Opens server
app.listen(port, () => {
    console.log(`Server Listening on Port ${port}`)
})

// API Call for getting team info
app.get('/team/info', async (req, res) => {
    //Call takes two query paramters: teamID and leagueID
    const teamID = req.query.teamID
    const leagueID = req.query.leagueID

    //Call a seperate function that gets database data and updates the database if necessary (Line 33 getTeamInfo())
    const data = await getTeamInfo(teamID, leagueID)
    console.log("Sending Team Info")
    res.header('Content-Type: application/json')
    res.send(JSON.stringify(data))
})

app.get('/players/info', async (req, res) => {
    const playerID = req.query.playerID
    console.log("Player ID: ", playerID)
    const data = await getPlayersInfo(playerID);
    console.log("Sending Players Info");
    res.header('Content-Type: application/json')
    res.send(JSON.stringify(data));
});

// Lets react handle  the routing between pages
app.get('*', (req, res) => {
    console.log("Serving Page")
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

//Retrieves data from databse and updates the database if the data from the database is old
async function getTeamInfo(teamID, leagueID) {
    const d = new Date();
    let year = d.getFullYear() - 1;
    console.log("Getting Team Info")

    // External API URL
    url = `https://api-football-v1.p.rapidapi.com/v3/teams/statistics?league=${leagueID}&season=${year}&team=${teamID}`

    // Retrieves team data and uses the filter team_ID and the parameter teamID
    const { data, error } = await supabase
        .from('teams')
        .select()
        .eq('team_id', teamID)
    // console.log(data)

    // Error handling. Needs some implementation but rn this will work
    if (error) {
        return {}
    }

    // Gets the current time in UNIX time and the converts the time in the database to UNIX time
    lastEntry = data[0]['created_at'].slice(0, 10)
    unixLastEntry = Math.floor(new Date(lastEntry).getTime() / 1000)
    unixCurrentTime = Math.floor(new Date().getTime() / 1000)

    // Checkks if the database is older than ~ a day old
    if (unixCurrentTime - unixLastEntry >= 84_000) {
        console.log("Updating Database")

        // Calls external API to get new data for database
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '2fef88074dmsh152cc0bbbaae36cp19843cjsn22175ba2aeef',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        })
        const resJson = await res.json()

        // console.log("New Response Data", resJson)

        //Puts new data from API in databse 
        const { upData, upError } = await supabase
            .from('teams')
            // Calls function cleanTeamJson. This function takes the API data and filters it out and restructures it so it matches the databse format.
            // Supabase documentation has some good explanations on how to update database 
            .update(cleanTeamJson(resJson))
            .eq('id', data[0]['id'])
            // Returns updated data. Without select, it would not return the new data and would only update the database
            .select()
        // If there is an error it returns the original data from the database
        if (upError) {
            return data
        }
        console.log("Returning Updated Data from Database")
        // console.log(upData)

        //Returns new data 
        return upData[0]
    }
    console.log("Returning Data from Database")

    // Returns data that was collected from database IF it did not need to be updated 
    return data
}

async function getPlayersInfo(playerID) {
    const d = new Date();
    let year = d.getFullYear() - 1;
    console.log("Getting Players Info");

    const url = `https://api-football-v1.p.rapidapi.com/v3/players?id=${playerID}&season=${year}`;

    const { data, error } = await supabase
        .from('players')
        .select()
        .eq('player_id', playerID);
    console.log("Supabase Data Pulled Down")
    if (error) {
        return {};
    }

    const lastEntry = data[0]['created_at'].slice(0, 10);
    const unixLastEntry = Math.floor(new Date(lastEntry).getTime() / 1000);
    const unixCurrentTime = Math.floor(new Date().getTime() / 1000);

    if (unixCurrentTime - unixLastEntry >= 84_000) {
        console.log("Updating Database");

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '2fef88074dmsh152cc0bbbaae36cp19843cjsn22175ba2aeef',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        });
        const resJson = await res.json();
        const { upData, upError } = await supabase
            .from('players')
            .update(cleanPlayersJson(resJson))
            .eq("id", data[0]['id'])
            .select();

        if (upError) {
            return data;
        }
        console.log("Returning Updated Data from Database",);
        console.log(upData)
        return upData[0];
    }
    console.log("Returning Data from Database");

    return data;
}

// Takes API Football response data and stores it in a new JSON obj that fits the format required by supabase
function cleanTeamJson(obj) {
    console.log(obj)
    let newObj = {}
    newObj["created_at"] = new Date()
    newObj['home_games'] = obj['response']['fixtures']['played']['home']
    newObj['away_games'] = obj['response']['fixtures']['played']['away']
    newObj['total_games'] = obj['response']['fixtures']['played']['total']

    newObj['home_wins'] = obj['response']['fixtures']['wins']['home']
    newObj['away_wins'] = obj['response']['fixtures']['wins']['away']
    newObj['total_wins'] = obj['response']['fixtures']['wins']['total']

    newObj['home_draws'] = obj['response']['fixtures']['draws']['home']
    newObj['away_draws'] = obj['response']['fixtures']['draws']['away']
    newObj['total_draws'] = obj['response']['fixtures']['draws']['total']

    newObj['home_losses'] = obj['response']['fixtures']['loses']['home']
    newObj['away_losses'] = obj['response']['fixtures']['loses']['away']
    newObj['total_losses'] = obj['response']['fixtures']['loses']['total']

    newObj['for_home_goals'] = obj['response']['goals']['for']['total']['home']
    newObj['for_away_goals'] = obj['response']['goals']['for']['total']['away']
    newObj['for_total_goals'] = obj['response']['goals']['for']['total']['total']

    newObj['against_home_goals'] = obj['response']['goals']['against']['total']['home']
    newObj['against_away_goals'] = obj['response']['goals']['against']['total']['away']
    newObj['against_total_goals'] = obj['response']['goals']['against']['total']['total']
    console.log('JSON Cleaned')
    // console.log(newObj)
    return newObj
}

function cleanPlayersJson(obj) {
    console.log(obj)
    let newObj = {};
    newObj["created_at"] = new Date();
    newObj['name'] = obj['response'][0]['player']['name'] + " " + obj['response'][0]['player']['lastname'];
    newObj['position'] = obj['response'][0]['statistics'][0]['games']['position'];
    newObj['picture'] = obj['response'][0]['player']['photo'];
    newObj['age'] = obj['response'][0]['player']['age'];
    newObj['nationality'] = obj['response'][0]['player']['nationality'];
    newObj['team'] = obj['response'][0]['statistics'][0]['team']['name'];
    newObj['total_shots'] = obj['response'][0]['statistics'][0]['shots']['total'];
    newObj['shots_on_goal'] = obj['response'][0]['statistics'][0]['shots']['on'];
    newObj['total_goals'] = obj['response'][0]['statistics'][0]['goals']['total'];
    newObj['goals_assists'] = obj['response'][0]['statistics'][0]['goals']['assists'];
    console.log('Players JSON Cleaned');
    console.log(newObj)
    return newObj;
}

/*
Player data to return:
Name
Picture
Position
Age

Nationality
Team

Total Shots
Shots On Goal

Total Goals
Goals Assists


Lmk if you have questions about implementation or anything else ~Noah
*/