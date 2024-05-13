const express = require("express")
const supabaseClient = require("@supabase/supabase-js")
const bodyParser = require("body-parser")


const app = express()
const port = 9000
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

const supabaseURL = 'https://qrsyjpzbwskvprkogtxa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyc3lqcHpid3NrdnBya29ndHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MTc3MTEsImV4cCI6MjAzMTE5MzcxMX0.AWplzUF32KSVE69nR13qcOiAiDedtelHlSdbW4nGLOg'

const supabase = supabaseClient.createClient(supabaseURL, supabaseKey)

app.get('/team/info', async (req, res) => {
    const teamID = req.query.teamID
    const leagueID = req.query.leagueID

    const data = await getTeamInfo(teamID, leagueID)
    console.log("Sending Team Info")
    res.send(JSON.stringify(data))
})


app.listen(port, () => {
    console.log(`Server Listening on Port ${port}`)
})

async function getTeamInfo(teamID, leagueID) {
    const d = new Date();
    let year = d.getFullYear() - 1;
    console.log("Getting Team Info")
    url = `https://api-football-v1.p.rapidapi.com/v3/teams/statistics?league=${leagueID}&season=${year}&team=${teamID}`
    const { data, error } = await supabase
        .from('teams')
        .select()
        .eq('team_id', teamID)
    // console.log(data)
    if (error) {
        return {}
    }

    lastEntry = data[0]['created_at'].slice(0, 10)
    unixLastEntry = Math.floor(new Date(lastEntry).getTime() / 1000)
    unixCurrentTime = Math.floor(new Date().getTime() / 1000)

    if (unixCurrentTime - unixLastEntry >= 84_000) {
        console.log("Updating Database")
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '10755b2a08msh15dff173eafe850p158f43jsnf3d99db20514',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        })
        const resJson = await res.json()

        // console.log("New Response Data", resJson)
        const { upData, upError } = await supabase
            .from('teams')
            .update(cleanTeamJson(resJson))
            .eq('id', data[0]['id'])
            .select()
        if (upError) {
            return data
        }
        console.log("Returning Updated Data from Database")
        // console.log(upData)
        return upData
    }
    console.log("Returning Data from Database")

    return data
}

function cleanTeamJson(obj) {
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