const express = require("express")
const app = express()
require('dotenv').config();
const helmet = require("helmet")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")
const mysql = require('promise-mysql')
const superagent = require('superagent')
const path = require('path')
const loggedInCheck = require('../lib/loggedInCheck.js')
//the first environment variable is local to Heroku, the second is in a local .env file for development
const databaseUrl = process.env.CLEARDB_DATABASE_URL || process.env.LOCAL_DATABASE_URL
const adminKey = process.env.ADMIN_KEY
const dataLoader = require("../lib/dataLoader.js")
console.log("database URL is", databaseUrl, ". connecting now")

//this next part first makes a connection pool to the database, 
//then instantiates the dataLoader with that pool,
// so the dataLoader can use pool.query
// (which is shorthand for: make a connection, query, close connection)
// then finally initialises the Express server.
const pool = mysql.createPool(databaseUrl)

initializeApp(new dataLoader(pool));

function initializeApp(dataLoader) {
    console.log("starting server.")
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    app.get('/', (req, res) => res.send("You have reached the Montreal Artist Database back-end. Try an endpoint!"))

    app.post('/api/v1/newsletter-subscribe',(req,res)=>{
        let email = req.body.email
        console.log('received the email:', email, '. Subscribing them to the mailing list');
        
        superagent.post('https://us18.api.mailchimp.com/3.0/lists/06f3863bc7/members')
        .send(
            {email_address:email,status:'subscribed'}
        )
        .auth('mad-backend','0839fa0ca24ab9e2c3b10bcc5713bb91-us18')
        .then(response=>res.json(response))
        .catch(err => 
            { console.error('error subscribing:',err)
            return res.status(404).json(err);})

    })
    app.get("/api/v1/genreIDs", (req, res) => {
        let { genre, searchterm } = req.query
        let responseObject = {}
        console.log("band_IDs requested. Genre:", genre, "searchterm:", searchterm);
        dataLoader.getIDs(genre, searchterm)
        .then(response => 
            {
                // responseObject.bandIdArray = bandIdArray;
            res.status(200).json(response)
            // return dataLoader.getSubGenres(genre,searchterm)}  
            }              
        )
        // .then(
        //     bandSubGenreArray => { 
        //         responseObject.bandSubGenreArray = bandSubGenreArray;
        //         res.status(200).json(responseObject)
        //     }

        // )
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

    app.post("/api/v1/submit/", (req, res) => {
        console.log("received submission for new band. name is", req.body.band_name)
        dataLoader.addBand(req.body)
            .then(id => {
                console.log("band inserted. ID is ", id);
                res.status(200).json({insertedId:id})
            })
            .catch(err => { console.error(err); res.status(500).send("Band submission failed. Please contact the webmaster.") })
    })

    app.get("/api/v1/admin/authenticate",loggedInCheck,(req,res)=> {
        console.log("authenticated the admin")
        res.status(200).json({approved:true})
    })

    app.get("/api/v1/admin/pendingIDs",(req,res) => {
        console.log('receiving request for pending band IDs.')
        dataLoader.getPendingIDs().then(bandIdArray => res.status(200).json(bandIdArray))
            .catch(err => {
                console.log(`error retrieving pending IDs: 
                ${err.code} ${err.sqlMessage} 
                SQL query was ${err.sql}`);
                return res.status(500).json("Error retrieving pending IDs. Sorry")

            })
    })

    app.get("/api/v1/admin/bandData", loggedInCheck, (req, res) => {
        console.log("Received request for admin data on band with ID:", req.query.band_id)
        dataLoader.adminGetSingleBand(req.query.band_id).then(bandObj => {
            console.log("Admin band data object retrieved. Name is ", bandObj[0].band_name)
            return res.status(200).json(bandObj)
        }).catch(err => {
            console.log(`error retrieving Admin band data object: 
            ${err.code} ${err.sqlMessage} 
            SQL query was ${err.sql}`)
            return res.status(500).json("Error retrieving band data. Sorry")
        })
    })

    app.post("/api/v1/admin/approveBand", loggedInCheck, (req, res) => {
        console.log("received approval for band with ID #", req.body.band_id)
        dataLoader.approveBand(req.body.band_id)
            .then(id => {
                console.log("band approved. ID is ", id);
                res.status(200).json({updatedID:id})
            })
            .catch(err => { console.error(err); res.status(500).send("Band submission failed. Please contact the webmaster.") })
    })

    app.post("/api/v1/admin/editBand", loggedInCheck, (req, res) => {
        console.log("received edit for band with ID #", req.body.band_id)
        dataLoader.editBand(req.body.band_id,req.body.bandObj)
            .then(id => {
                console.log("band edited. ID is ", id);
                res.status(200).json({updatedID:id})
            })
            .catch(err => { console.error(err); res.status(500).send("Band submission failed. Please contact the webmaster.") })
    })

    app.delete("/api/v1/admin/deleteBand", loggedInCheck, (req,res) => {
        console.log('received delete request for band with ID #', req.body.band_id)
        dataLoader.deleteBand(req.body.band_id)
        .then(response=>{
            console.log('band deleted');
            res.status(202).send()
        })
        .catch(err=>{
            console.error('error deleting band:',err)
            res.status(500).send("Band deletion failed. Please contact the webmaster")
        })
    })


    //this is our error Handler Middleware
    app.use(function (err, req, res, next) {
        console.log(err)
        res.status(500).send("We're sorry, we couldn't handle your request. Please contact the webmaster.")
    })


    app.listen(process.env.PORT || 3005, () => console.log('Server is live and taking requests!'))
}