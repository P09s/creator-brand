const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Connect to MongoDB and run server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5050, () => console.log("Server running on http://localhost:5050"));
  })
  .catch((err) => console.error(err));

  