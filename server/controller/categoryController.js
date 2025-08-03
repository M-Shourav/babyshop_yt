import asyncHandler from "express-async-handler";
import Category from "../models/categoryModels.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.json({
        success: false,
        message: "Category name is required.",
      });
    }
    const existingCat = await Category.findOne({ name });
    if (existingCat) {
      return res.json({
        success: false,
        message: "Category name is already taken. try, another category",
      });
    }

    const category = await Category.create({
      name,
      description,
    });
    return res.json({
      success: true,
      message: "Category create successfully",
      category,
    });
  } catch (error) {
    console.log("category create error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const catId = await Category.findById(req.params.id);
    if (!catId) {
      return res.json({
        success: false,
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(catId);
    return res.json({
      success: true,
      message: "Category delete successfully",
    });
  } catch (error) {
    console.log("category delete error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;
    const catId = await Category.findById(req.params.id);
    if (!catId) {
      return res.json({
        success: false,
        message: "Category not found with this id",
      });
    }

    if (name) catId.name = name;
    if (description) catId.description = description;

    const update = await catId.save();

    return res.json({
      success: true,
      message: "Category update successfully",
      update,
    });
  } catch (error) {
    console.log("Failed update to category", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const singleCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.json({
        success: false,
        message: "Not found category with the name",
      });
    }

    return res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.log("Fetching Single category error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const total = await Category.countDocuments({});
    const category = await Category.find({});
    return res.json({
      success: true,
      total,
      category,
    });
  } catch (error) {
    console.log("Fetching all category error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

export {
  createCategory,
  deleteCategory,
  updateCategory,
  singleCategory,
  getAllCategory,
};
