import { Router } from "express";
import {
  deleteUser,
  GetUserList,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controller/userController.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/delete/:id", deleteUser);
userRouter.get("/profile", GetUserList);
userRouter.put("/update/:id", updateUser);

export default userRouter;
