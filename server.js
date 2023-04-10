const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const path = require("path");

app.use(express.json({ strict: false }));
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method}  ${req.url}  `, req.body);
  next();
});

app.get("/", (req, res) => {
  res.redirect("/albums");
});

app.get("/albums", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000);
