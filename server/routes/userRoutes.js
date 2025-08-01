import { Router } from "express";
import {
  deleteUser,
  GetUserList,
  loginUser,
  logoutUser,
  registerUser,
  singleProfile,
  updateUser,
} from "../controller/userController.js";
import upload from "../middlewares/multer.js";

const userRouter = Router();

userRouter.post("/register", upload.single("avatar"), registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/delete/:id", deleteUser);
userRouter.get("/profile", GetUserList);
userRouter.get("/singleProfile", singleProfile);
userRouter.put("/update/:id", upload.single("avatar"), updateUser);

export default userRouter;
