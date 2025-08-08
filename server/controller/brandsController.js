import asyncHandler from "express-async-handler";
import Brand from "../models/brandsModels.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

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

    let images;
    if (req.file) {
      const file = await cloudinary.uploader.upload(req.file?.path, {
        folder: "brand-image",
        resource_type: "image",
      });

      images = {
        url: file?.secure_url,
        public_id: file?.public_id,
      };
      fs.unlinkSync(req.file?.path);
    }

    const brand = await Brand.create({
      name,
      description,
      images,
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

    if (brandsId?.images.public_id) {
      await cloudinary.uploader.destroy(brandsId.images.public_id);
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

    if (req.file) {
      if (brand?.images && brand.images.public_id) {
        await cloudinary.uploader.destroy(brand?.images.public_id);
      }

      const updateImage = await cloudinary.uploader.upload(req.file?.path, {
        folder: "brand-image",
        resource_type: "image",
      });

      brand.images = {
        url: updateImage.secure_url,
        public_id: updateImage.public_id,
      };
      fs.unlinkSync(req.file?.path);
    }

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
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand) {
      return res.json({
        success: false,
        message: "brand not found",
      });
    }

    return res.json({
      success: true,
      brand,
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
