import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import userModel from "../models/userModels.js";

export const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({
        success: false,
        message: "Unauthorized, token not found",
      });
    }

    // verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decode.id).select("-password");
    if (!user) {
      return res.json({
        success: false,
        message: "Unauthorized, user not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Unauthorized, invalid token");
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

export const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }
});
