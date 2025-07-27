import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectMongoDB.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
dotenv.config(); //config dotenv

const port = process.env.PORT || 8000;

connectDB(); //mongodb connect
app.use(express.json()); //json convert

app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello style-mart");
});

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
