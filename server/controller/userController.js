import asyncHandler from "express-async-handler";
import validator from "validator";
import userModel from "../models/userModels.js";
import cloudinary from "../utils/cloudinary.js";
import generateToken from "../utils/GenerateToken.js";
import jwt from "jsonwebtoken";
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "Email already taken, try a different email",
      });
    }

    // Upload avatar if provided
    let avatar = {
      url: "https://res.cloudinary.com/drswdtncv/image/upload/v1753807270/images_wuqnyi.jpg", // default
      public_id: "",
    };
    if (req.file) {
      const file = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
        folder: "avatars",
      });

      avatar = {
        url: file.secure_url,
        public_id: file.public_id,
      };
    }

    const user = await userModel.create({
      name,
      email,
      password,
      role,
      address: [],
      avatar: avatar,
    });

    return res.json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        address: user.address,
      },
    });
  } catch (error) {
    console.log("Register Error:", error);
    return res.json({
      success: false,
      message: error.message || "Internal Server Error",
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
        message: "user doesn't exists!",
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
        message: "Invalid credential try again!",
      });
    }
  } catch (error) {
    console.log("user login error:", error);
    return res.json({
      success: false,
      message: error?.message,
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
    console.log("logout error:", error);
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
    console.log("user removed error:", error);
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
    console.log("user update error:", error);
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
    console.log("Get all user error:", error);
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
    console.log("single profile error:", error);
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
