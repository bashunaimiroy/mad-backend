const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const bands = require("./bands.json")

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))
app.get("/api/bands", (req, res) => res.send('bands'))


app.listen(3000, () => console.log('Example app listening on port 3000!'))