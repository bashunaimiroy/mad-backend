// const express = require("express")
// const app = express()
const bodyParser = require("body-parser")
const bands = require("./bands.json")

// app.use(morgan('dev'))
// app.use(cors())
// app.use(bodyParser.json())


// app.get("/api/bands", (req, res) => (res.send(bands)))

// app.listen(process.env.PORT || 3000)


app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))