const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const bands = require("../data/new-bands.json")
const morgan = require("morgan")
const cors = require("cors")
const mysql = require('promise-mysql')
const qs = require("querystring")
const { databaseUrl } = require("../data/config.js")
const journalDataLoader = require("../lib/dataLoader.js")

console.log("database URL is", databaseUrl)

const connection = mysql.createConnection(

    databaseUrl
)
    .then(connection => InitializeApp(new journalDataLoader(connection)))

function InitializeApp(dataLoader) {
    console.log("starting server.")

    app.use(morgan('dev'))
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false }))

    app.get('/', (req, res) => res.send("We're Live at Express!"))


    
    app.get("/api/v1/bands/", (req, res) => {
        //we want to receive an array of IDs here in the querystring. Don't know how, yet.
        console.log("received 12-band request. IDs are", req.query)
        let bandIdsString = req.query.bandIdArray
        console.log("string is",bandIdsString)
        dataLoader.getBands(bandIdsString).then(bands => {
            console.log("we found bands:", bands);

            return res.status(200).json(bands)
        })
    })

    // //add a database call here


    //sends back one artist object
    app.get("/api/band/:id", (req, res) => {
        //add a database call here

        return res.status(200).json({
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
        })
    })

    app.listen(process.env.PORT || 3000, () => console.log('We are live on port 3000!'))
}