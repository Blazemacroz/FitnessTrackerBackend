require("dotenv").config()
const express = require("express")
const app = express()
// const PORT = process.env.PORT || 3000
const morgan = require('morgan')
const router = require('./api');
// const { client } = require('./db');
const cors = require('cors')
// Setup your Middleware and API Router here
// client.connect();
app.use(cors());

app.use(morgan("dev"))

app.use(express.json())

app.use("/api", router)

app.get("/", (req, res) => {
    res.send('<h1>Welcome to Fitness Tracker Backend!</h1>');
})

module.exports = app;
