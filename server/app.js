const express = require("express")
const supabaseClient = require("@supabase/supabase-js")
const bodyParser = require("body-parser")


const app = express()
const port = 9000
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

const supabaseURL = 'https://qrsyjpzbwskvprkogtxa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyc3lqcHpid3NrdnBya29ndHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2MTc3MTEsImV4cCI6MjAzMTE5MzcxMX0.AWplzUF32KSVE69nR13qcOiAiDedtelHlSdbW4nGLOg'


app.get('/team/info', (req, res) => {

})


app.listen(port, () => {
    console.log(`Server Listening on Port ${port}`)
})

