const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const bands = require("./new-bands.json")
const morgan = require("morgan")
const cors = require("cors")

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!')) 

// sends array of 12 artist objects
// will need some kind of function in order to randomize/specify the band objects that are sent back
app.get("/api/bands", (req, res) => {
    console.log('headers are',req.headers);
    const page = Number(req.param('page'));
    const start = page*12
    const end = start+12
    console.log('start:',start,'start',end )
    res.status(200).json(bands.slice(start, end))
})

//sends back one artist object
app.get("/api/bands/:id", (req, res) => res.status(200).json({
    "Name": "Sweat",
    "Genre": "Jangle Pop",
    "Music Link": "http://sweatmtl.bandcamp.com/",
    "Apple Music": "https://itunes.apple.com/ca/artist/sweat/1108674748",
    "Spotify": "https://open.spotify.com/artist/3GqfGuJW6DWAwJxh8VwBA3",
    "Facebook": "https://www.facebook.com/sosweatyband/?fref=ts",
    "Instagram": "https://www.instagram.com/_sweatband/",
    "Twitter": "N/A",
    "YouTube": "N/A",
    "Photos": "https://imgur.com/a/JBU1L",
    "Band E-mail": "sweatbandmtl@gmail.com ",
    "Managment E-Mail": "N/A",
    "Booking E-Mail": "N/A",
    "PR E-mail": "N/A",
    "Band Members": "Robben Lent\nGeorgia Gleason\nJordan Siemens\nAlan McTavish"
}))




app.listen(3000, () => console.log('Example app listening on port 3000!'))