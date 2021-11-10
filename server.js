// DEPENDENCIES
/// get .env variables
require("dotenv").config()
// pull PORT from .env, give it a default of 3000 (object destructuring)
const { PORT = 3000, DATABASE_URL } = process.env
// import express
const express = require("express")
// create application object
const app = express()
// import mongoose
const mongoose = require("mongoose")
// IMPORT MIDDLEWARE
const cors = require("cors")
const morgan = require("morgan")

// DATABASE CONNECTION

// establish connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to Mongo"))
.on("close", () => console.log("You are disconnected from Mongo"))
.on("error", (error) => console.log(error))

// MODELS
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
}, {timestamps:true})

const Cheese = mongoose.model("Cheese", CheeseSchema)

// MIDDLEWARE
app.use(cors()) // prevent cors erros, opens up access for frontend
app.use(morgan("dev")) // loggging
app.use(express.json()) // parse json bodies

// routes

// test route
app.get("/", (req, res) => {
    res.send("Cheese")
})

// cheese index route
app.get("/cheese" , async (req, res) => {
    try{
        // send all people
        res.json(await Cheese.find({}))
    } catch(error) {
        res.status(400).json({error})
    }
})
//cheese create route
app.post("/cheese", async (req, res) => {
    try {
      // create a new person
      res.json(await Cheese.create(req.body));
    } catch (error) {
      res.status(400).json({ error });
    }
  });
// cheese update route
app.put("/cheese/:id", async (req, res) => {
    try {
        // update a person
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}));
      } catch (error) {
        res.status(400).json({ error });
      }
})
// cheese delete route
app.delete("/cheese/:id", async (req, res) => {
    try {
        // delete a person
        res.json(await Cheese.findByIdAndRemove(req.params.id));
      } catch (error) {
        res.status(400).json({ error });
      }
})


// SERVER LISTENER
app.listen(PORT, () => {console.log(`listening on PORT ${PORT}`)})
