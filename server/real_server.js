const express = require("express")
const app = express()
require('dotenv').config();
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")
const mysql = require('promise-mysql')
//the first environment variable is local to Heroku, the second is in a local .env file for development
const databaseUrl = process.env.CLEARDB_DATABASE_URL || process.env.LOCAL_DATABASE_URL
const dataLoader = require("../lib/dataLoader.js")
console.log("database URL is", databaseUrl,". connecting now")

//this next part first makes the connection to the database, then instantiates the dataLoader with
//that connection, then finally initialises the Express server.
const connection = mysql.createConnection(databaseUrl)
    .then(connection => InitializeApp(new dataLoader(connection)))

function InitializeApp(dataLoader) {
    console.log("starting server.")

    app.use(morgan('dev'))
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false }))

    app.get('/', (req, res) => res.send("Bashu's Server is running!"))


    app.get("/api/v1/genreIDs", (req,res)=>{
        console.log("band_IDs for ",req.query.genre," requested. Fetching..");
        dataLoader.getIDs(req.query.genre).then(bandIdArray=>res.status(200).json(bandIdArray))
    })

    app.get("/api/v1/bands/", (req, res) => {
        console.log("received request for bands, number is", req.query.bandIdArray.length)
        dataLoader.getBands(req.query.bandIdArray).then(bands => {
            console.log("we found bands");

            return res.status(200).json(bands)
        })
    })



    //sends back one artist object
    app.get("/api/band/:id", (req, res) => {
        
        
    })

    app.listen(process.env.PORT || 3005, () => console.log('Server is live!'))
}