const express = require("express")

const app = express()

const port = 9000


var items = [
    {
        "name": "item1",
        "price": "100"
    },
    {
        "name": "item2",
        "price": "200"
    }
]

app.get('/api/items', (req, res) => {
    res.send(items)

})

app.get('/api/team/dailyInfo', (req, res) => {

})


app.listen(port, () => {
    console.log(`Server Listening on Port ${port}`)
})

