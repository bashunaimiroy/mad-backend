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
console.log("database URL is", databaseUrl, ". connecting now")

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


    app.get("/api/v1/genreIDs", (req, res) => {
        let { genre, searchterm } = req.query
        console.log("band_IDs requested. Genre:", genre, "searchterm:", searchterm);
        dataLoader.getIDs(genre, searchterm).then(bandIdArray => res.status(200).json(bandIdArray))
            .catch(err => {
                console.log(`error retrieving IDs: 
                ${err.code} ${err.sqlMessage} 
                SQL query was ${err.sql}`);
                return res.status(500).json("Error retrieving IDs. Sorry")

            })
    })
    app.get("/api/v1/bandData", (req, res) => {
        console.log("Received request for data on band with ID:", req.query.band_id)
        dataLoader.getSingleBand(req.query.band_id).then(bandObj => {
            console.log("Band data object retrieved. Name is ", bandObj[0].band_name)
            return res.status(200).json(bandObj)
        }).catch(err => {
            console.log(`error retrieving band data object: 
            ${err.code} ${err.sqlMessage} 
            SQL query was ${err.sql}`)
            return res.status(500).json("Error retrieving band data. Sorry")
        })
    })

        app.get("/api/v1/bands/", (req, res) => {
            console.log("received request for bands, number is", req.query.bandIdArray.length)
            dataLoader.getBands(req.query.bandIdArray).then(bands => {
                console.log("we found bands");

                return res.status(200).json(bands)
            }).catch(err => {
                console.log(`error retrieving bands: 
                        ${err.code} ${err.sqlMessage} 
                        SQL query was ${err.sql}`)
                return res.status(500).json("Error retrieving Bands. Sorry")

            })
        })

        //this is our error Handler Middleware
        app.use(function (err, req, res, next) {
            console.log(err)
            res.status(500).send("We're sorry, we couldn't handle your request. Please contact the webmaster.")
          })
    

        app.listen(process.env.PORT || 3005, () => console.log('Server is live!'))
    }