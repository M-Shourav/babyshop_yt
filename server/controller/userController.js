import asyncHandler from "express-async-handler";
import validator from "validator";
import userModel from "../models/userModels.js";
import cloudinary from "../utils/cloudinary.js";
import generateToken from "../utils/GenerateToken.js";
import jwt from "jsonwebtoken";
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name) {
      return res.json({
        success: false,
        message: "Name is required",
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

    // check valid email
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Invalid email address, try again!",
      });
    }

    // check user
    const ExistingUser = await userModel.findOne({ email });
    if (ExistingUser) {
      return res.json({
        success: false,
        message: "User already exists, try different email!",
      });
    }

    // image upload cloudinary
    const uploadCloudinary = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "avatar",
    });
    const user = await userModel.create({
      name,
      email,
      password,
      role,
      avatar: {
        url: uploadCloudinary.secure_url,
        public_id: uploadCloudinary.public_id,
      },
      address: [],
    });
    if (user) {
      return res.json({
        success: true,
        message: "User Register successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          avatar: user.avatar,
          address: user.address,
        },
      });
    } else {
      return res.json({
        success: false,
        message: "User Register Failed",
      });
    }
  } catch (error) {
    console.error("Register error", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Email doesn't exists, try current email address",
      });
    }
    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      const token = generateToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.json({
        success: true,
        message: "user loggedIn successfully",
      });
    } else {
      return res.json({
        success: false,
        message: "Password not match, please try current password",
      });
    }
  } catch (error) {
    console.error("User login error:", error);
    return res.json({
      success: false,
      message: "Failed loggedIn,try again",
    });
  }
});
const logoutUser = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.json({
      success: true,
      message: "user logout successfully",
    });
  } catch (error) {
    console.error("logout error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.json({
        success: false,
        message: "user not found or not matching with actual user.",
      });
    }
    await userModel.findByIdAndDelete(user);
    return res.json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    console.error("user removed error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const updateUser = asyncHandler(async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }

    if (name) user.name = name;
    if (email) {
      if (!validator.isEmail(email)) {
        return res.json({
          success: false,
          message: "Invalid email address, try different email ",
        });
      }
      user.email = email;
    }

    // update user
    const update = await user.save();

    return res.json({
      success: true,
      message: "user update successfully.",
      user: {
        _id: update._id,
        name: update.name,
        email: update.email,
        password: update.password,
        role: update.role,
        avatar: update.avatar,
        cart: update.cart,
        address: update.address,
        whitelist: update.whitelist,
      },
    });
  } catch (error) {
    console.error("user update error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

const GetUserList = asyncHandler(async (req, res) => {
  try {
    const total = await userModel.countDocuments({});
    const user = await userModel.find().select("-password");
    return res.json({
      success: true,
      total,
      user,
    });
  } catch (error) {
    console.error("Get all user error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

const singleProfile = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies?.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne(decode._id).select("-password");
    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("single profile error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  updateUser,
  GetUserList,
  singleProfile,
};
