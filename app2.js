const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config()
const cors =require("cors")
const app = express();
app.use(cors());
const Room = require("./Models/room")



mongoose.connect(process.env.DB)
.then(()=> console.log("connected to database"))
.catch((err)=>console.error("Error connecting to the database:", err))

app.get("/", async (req, res) => {
  Room.insertMany([
    {
      room: "apple 단톡방",
      members: [],
    },
    {
      room: "banana 단톡방",
      members: [],
    },
    {
      room: "Cherry 단톡방",
      members: [],
    },
  ])
    .then(() => res.send("ok"))
    .catch((error) => res.send(error));
});

module.exports = app;