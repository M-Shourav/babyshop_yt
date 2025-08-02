import express from "express";
import connectDB from "./config/connectMongoDB.js";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import brandRouter from "./routes/brandsRoutes.js";
const app = express();
dotenv.config();
const port = process.env.PORT || 8000;

connectDB();
const whiteList = [process.env.ADMIN_URL, process.env.CLIENT_URL];
app.use(
  cors({
    origin: whiteList,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", router);
app.use("/api/brand", brandRouter);
// app.use("/api/category")

app.get("/", (req, res) => {
  res.send("Hello Style-Mert server");
});

app.listen(port, () => {
  console.log(`admin server running on port:${process.env.ADMIN_URL}`);
  console.log(`server is running on port: ${port}`);
});
