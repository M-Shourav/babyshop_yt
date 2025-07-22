import { Router } from "express";
import {
  getUser,
  loginUser,
  registerUser,
} from "../controller/authController.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/profile", getUser);

export default authRouter;
