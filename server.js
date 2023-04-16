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

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

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

app.put("/api/albums/:id", async (req, res) => {
  try {
    var id = req.params.id;
    const albumToUpdate = req.body;
    const updateAndReturn = await album
      .findByIdAndUpdate(id, albumToUpdate, { new: true })
      .then(() => {
        console.log("Updated");
      })
      .catch((error) => {
        res.status(404).send({ status: "error", message: error });
      });
    res.json(updateAndReturn);
  } catch (error) {}
});

app.delete("/api/albums/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await album.findByIdAndDelete(id);
    res.sendStatus(200);
  } catch (error) {
    res.status(404).send({ status: "error", message: error });
  }
});

app.listen(port);
