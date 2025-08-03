import asyncHandler from "express-async-handler";
import cloudinary from "../utils/cloudinary.js";
import Products from "../models/productModels.js";
import path from "path";
import fs from "fs";
const createProducts = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discount,
      brand,
      category,
      stock,
      tags,
      isFeatured,
    } = req.body;

    const images = [];

    for (const file of req.files) {
      const filePath = path.join(file.path);

      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: "auto",
        folder: "styleMert-products",
      });

      images.push({
        url: result.secure_url,
        public_id: result.public_id,
      });

      fs.unlinkSync(filePath);
    }

    if (!brand) {
      return res.json({
        success: false,
        message: "Brand is required!",
      });
    }
    if (!category) {
      return res.json({
        success: false,
        message: "Category is required!",
      });
    }

    const existingProduct = await Products.findOne({ title });
    if (existingProduct) {
      return res.json({
        success: true,
        message: "product already taken.try another",
      });
    }

    const product = await Products.create({
      title,
      description,
      price,
      discount,
      brand,
      category,
      stock,
      tags: tags?.split(" ") || [],
      isFeatured,
      images,
    });

    return res.json({
      success: true,
      message: "Product create successfully",
      product,
    });
  } catch (error) {
    console.log("Create products error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const deleteProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.json({
        success: false,
        message: "product not found",
      });
    }

    // delete images from cloudinary
    for (const img of product?.images) {
      await cloudinary.uploader.destroy(img?.public_id);
    }
    await Products.findByIdAndDelete(product);

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("Failed delete to product:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const updateProducts = asyncHandler(async (req, res) => {});
const singleProducts = asyncHandler(async (req, res) => {});
const allProducts = asyncHandler(async (req, res) => {});

export {
  createProducts,
  deleteProducts,
  updateProducts,
  singleProducts,
  allProducts,
};
