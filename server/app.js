const express = require("express")
const supabaseClient = require("@supabase/supabase-js")
const bodyParser = require("body-parser")


const app = express()
const port = 9000
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

const supabaseURL = 'https://qrsyjpzbwskvprkogtxa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyc3lqcHpid3NrdnBya29ndHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MTc3MTEsImV4cCI6MjAzMTE5MzcxMX0.AWplzUF32KSVE69nR13qcOiAiDedtelHlSdbW4nGLOg'

// Creates connection to database
const supabase = supabaseClient.createClient(supabaseURL, supabaseKey)

// API Call for getting team info
app.get('/team/info', async (req, res) => {
    //Call takes two query paramters: teamID and leagueID
    const teamID = req.query.teamID
    const leagueID = req.query.leagueID

    //Call a seperate function that gets database data and updates the database if necessary (Line 33 getTeamInfo())
    const data = await getTeamInfo(teamID, leagueID)
    console.log("Sending Team Info")
    res.send(JSON.stringify(data))
})

//Opens server
app.listen(port, () => {
    console.log(`Server Listening on Port ${port}`)
})

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
                'X-RapidAPI-Key': '10755b2a08msh15dff173eafe850p158f43jsnf3d99db20514',
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
        return upData
    }
    console.log("Returning Data from Database")

    // Returns data that was collected from database IF it did not need to be updated 
    return data
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

The new function needs to return that information for two players

Lmk if you have questions about implementation or anything else ~Noah
*/