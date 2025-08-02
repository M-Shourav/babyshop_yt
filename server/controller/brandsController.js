import asyncHandler from "express-async-handler";
import Brand from "../models/brandsModels.js";

const createBrand = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.json({
        success: false,
        message: "Please entered Brands name.",
      });
    }

    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.json({
        success: false,
        message: "Brand name already exists try another name",
      });
    }

    const brand = await Brand.create({
      name,
      description,
    });

    return res.json({
      success: true,
      message: "Brand create successfully",
      brand,
    });
  } catch (error) {
    console.log("Brands create error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const deleteBrand = asyncHandler(async (req, res) => {
  try {
    const brandsId = await Brand.findById(req.params.id);
    if (!brandsId) {
      return res.json({
        success: false,
        message: "No brands found.",
      });
    }
    await Brand.findByIdAndDelete(brandsId);
    return res.json({
      success: true,
      message: "Brand remove successfully",
    });
  } catch (error) {
    console.log("Brand removed error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const updateBrand = asyncHandler(async (req, res) => {
  try {
    const { name, description } = req.body;
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.json({
        success: false,
        message: "Brand id not match",
      });
    }

    if (name) brand.name = name;
    if (description) brand.description = description;

    const update = await brand.save();

    return res.json({
      success: true,
      message: "Brand update successfully",
      update,
    });
  } catch (error) {
    console.log("Brands update error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const singleBrand = asyncHandler(async (req, res) => {
  try {
    const brandSlug = await Brand.findOne({ slug: req.params.slug });
    if (!brandSlug) {
      return res.json({
        success: false,
        message: "brand not found",
      });
    }

    return res.json({
      success: true,
      brandSlug,
    });
  } catch (error) {
    console.log("single brands error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const total = await Brand.countDocuments({});
    const brand = await Brand.find({});
    return res.json({
      success: true,
      total,
      brand,
    });
  } catch (error) {
    console.log("Fetching all brand error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

export { createBrand, deleteBrand, updateBrand, singleBrand, getAllBrand };
