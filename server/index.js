import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectMongoDB.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
dotenv.config(); //config dotenv

const port = process.env.PORT || 8000;

connectDB(); //mongodb connect

const whiteList = [process.env.ADMIN_URL, process.env.CLIENT_URL];

app.use(
  cors({
    origin: whiteList,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json()); //json convert

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello style-mart");
});

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
