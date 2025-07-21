import asyncHandler from "express-async-handler";
import validator from "validator";
import UserModel from "../models/userModel.js";
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name) {
      return res.json({
        success: false,
        message: "Name is required!",
      });
    }
    if (!email) {
      return res.json({
        success: false,
        message: "Email is required!",
      });
    }
    if (!password) {
      return res.json({
        success: false,
        message: "Password is required!",
      });
    }
    // check valid email address
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Invalid email address!",
      });
    }

    // check user
    const ExistingUser = await UserModel.findOne({ email });
    if (ExistingUser) {
      return res.json({
        success: false,
        message: "User already exists, try different",
      });
    }
    // create user
    const user = await UserModel.create({
      name,
      email,
      password,
      role,
      address: [],
    });

    if (user) {
      return res.json({
        success: true,
        message: "user register successfully.",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          avatar: user.avatar,
          role: user.role,
          address: user.address,
        },
      });
    } else {
      return res.json({
        success: false,
        message: "user register failed, try again!",
      });
    }
  } catch (error) {
    console.log("user register error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.json({
        success: false,
        message: "Email is required!",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found , try different account.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid password",
      });
    }

    return res.json({
      success: true,
      message: "register successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        address: user.address || [],
      },
    });
  } catch (error) {
    console.log("user login error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

export { registerUser, loginUser };
