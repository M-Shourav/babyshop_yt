import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorize , No Token",
    });
  }
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await UserModel.findById(decode.id).select("-password");
      next();
    } catch (error) {
      console.log("Bearer token error:", error);
      return res.json({
        success: false,
        message: error?.message,
      });
    }
  }
});

// admin

export { protect };
