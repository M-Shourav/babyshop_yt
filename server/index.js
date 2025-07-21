import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import connectDB from "./config/mongoDB.js";
const app = express();
dotenv.config(); //dotenv setup
const port = process.env.PORT || 8000;

connectDB(); //mongoDB connect

app.use(express.json()); // json data parse

app.use("/api/auth", authRouter); //auth routes

app.get("/", (req, res) => {
  res.send("Hello babyshop server");
});

app.listen(port, () => {
  console.log(`server running on port:${port}`);
  console.log(`client running on:${process.env.CLIENT_URL}`);
  console.log(`admin running on:${process.env.ADMIN_URL}`);
});
