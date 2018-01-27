const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const bands = require("../data/new-bands.json")
const morgan = require("morgan")
const cors = require("cors")
const mysql = require('promise-mysql')
const {localURL} = require("../data/config")
const databaseUrl = process.env.CLEARDB_DATABASE_URL || localURL
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

    app.get('/', (req, res) => res.send("Bashu's Server is running!"))


    
    app.get("/api/v1/bands/", (req, res) => {
        console.log("received 12-band request. IDs are", req.query)
        console.log("string is",req.query.bandIdArray)
        dataLoader.getBands(req.query.bandIdArray).then(bands => {
            console.log("we found bands:", bands);

            return res.status(200).json(bands)
        })
    })



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

    app.listen(process.env.PORT || 3000, () => console.log('Server is live!'))
}