import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectMongoDB.js";

const app = express();
dotenv.config(); //config dotenv

const port = process.env.PORT || 8000;

connectDB(); //mongodb connect

app.get("/", (req, res) => {
  res.send("Hello style-mart");
});

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
