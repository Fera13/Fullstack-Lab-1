const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const album = require("./Albums");
require("dotenv").config();

const port = process.env.PORT || 3000;
const uri = process.env.URI;

app.use(express.json());
app.use(bodyParser.json());

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((error) => console.error("Error in the connection", error));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/albums", async (req, res) => {
  try {
    const albums = await album.find();
    console.log(albums);
    res.json(albums);
  } catch (error) {
    res.status(500).json("Error in getting the albums");
  }
});

app.post("/api/albums", async (req, res) => {
  try {
    const info = req.body;
    const newAlbum = new album({
      title: info.title,
      artist: info.artist,
      year: info.year,
    });
    await newAlbum.save();
    res.status(201).send(newAlbum);
  } catch (error) {
    console.log(error);
    res.sendStatus(409);
  }
});

app.listen(port);
