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

const startServer =async ()=> {
  // Connect to MongoDB and run server
 try {
  await mongoose.connect(process.env.MONGO_URI, {}
  ).then(() => {
    console.log("Connected to MongoDB");
  }).catch((error) => {
    console.error("MongoDB connection error:", error);
  });
  app.listen(3000,()=> {
    console.log("Server is running on port 3000");
  })
 } catch (error) {
  console.log("Error connecting to MongoDB:", error);
  process.exit(1);
 }
}

startServer()