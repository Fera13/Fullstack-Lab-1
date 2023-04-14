const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const album = require("./Albums");
const port = process.env.PORT;
const uri = process.env.URI;
require("dotenv").config();

app.use(express.json({ strict: false }));
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method}  ${req.url}  `, req.body);
  next();
});

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3000);
    console.log("MongoDB is connected and the server is listening");
  })
  .catch((error) => console.error("Error in the connection", error));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/albums", async (req, res) => {});
