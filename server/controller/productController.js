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

    const existingProduct = await Products.findOne({ title });
    if (existingProduct) {
      return res.json({
        success: true,
        message: "product already taken.try another",
      });
    }

    if (!brand) {
      return res.json({
        success: false,
        message: "Brand is required!",
      });
    }
    // if (!category) {
    //   return res.json({
    //     success: false,
    //     message: "Category is required!",
    //   });
    // }

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

    const product = await Products.create({
      title,
      description,
      price,
      discount,
      brand,
      category,
      stock,
      tags,
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
const updateProducts = asyncHandler(async (req, res) => {
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
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (discount) product.discount = discount;
    if (brand) product.brand = brand;
    if (category) product.category = category;
    if (stock) product.stock = stock;
    if (tags) product.tags = tags;
    if (isFeatured) product.isFeatured = isFeatured;

    if (req.files && req.files.length > 0) {
      if (product.images && product.images.length > 0) {
        for (const img of product.images) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      const images = [];

      for (const file of req.files) {
        const filePath = path.join(file.path);
        const result = await cloudinary.uploader.upload(filePath, {
          resource_type: "image",
          folder: "styleMert-products",
        });

        images.push({
          url: result.secure_url,
          public_id: result.public_id,
        });

        fs.unlinkSync(filePath);
      }

      product.images = images;
    }

    const update = await product.save();

    return res.json({
      success: true,
      message: "Product data update successfully",
      update,
    });
  } catch (error) {
    console.log("product update error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const singleProducts = asyncHandler(async (req, res) => {
  try {
    const productBySlug = await Products.findOne({ slug: req.params.slug })
      .populate("brand", "name")
      .populate("category", "name");
    if (!productBySlug) {
      return res.json({
        success: false,
        message: "product not found",
      });
    }

    return res.json({
      success: true,
      productBySlug,
    });
  } catch (error) {
    console.log("Single product error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const allProducts = asyncHandler(async (req, res) => {
  try {
    const total = await Products.countDocuments({});
    const products = await Products.find({});
    return res.json({
      success: true,
      total,
      products,
    });
  } catch (error) {
    console.log("Fetching all product error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

export {
  createProducts,
  deleteProducts,
  updateProducts,
  singleProducts,
  allProducts,
};
