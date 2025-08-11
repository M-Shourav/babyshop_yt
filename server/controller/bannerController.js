import asyncHandler from "express-async-handler";
import Banner from "../models/bannerModels.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
const createBanner = asyncHandler(async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    const Existing = await Banner.findOne({ title });
    if (Existing) {
      return res.json({
        success: false,
        message: error?.message,
      });
    }
    let image;
    if (req.file) {
      const file = await cloudinary.uploader.upload(req.file?.path, {
        resource_type: "image",
        folder: "banner-image",
      });

      image = {
        url: file?.secure_url,
        public_id: file?.public_id,
      };
      fs.unlinkSync(req.file?.path);
    }

    const banner = await Banner.create({
      title,
      subtitle,
      image,
    });
    return res.json({
      success: true,
      message: "Banner create successfully.",
      banner,
    });
  } catch (error) {
    console.log("Banner create error:", error);
    return res.json({
      success: true,
      message: error?.message,
    });
  }
});
const deleteBanner = asyncHandler(async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.json({
        success: false,
        message: "Banner not found",
      });
    }

    if (banner?.image.public_id) {
      await cloudinary.uploader.destroy(banner?.image.public_id);
    }
    await Banner.findByIdAndDelete(banner);
    return res.json({
      success: true,
      message: "Banner delete successfully",
    });
  } catch (error) {
    console.log("Banner delete error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const updateBanner = asyncHandler(async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.json({
        success: false,
        message: "banner not found",
      });
    }

    if (title) banner.title = title;
    if (subtitle) banner.subtitle = subtitle;
    if (req.file) {
      if (banner.image && banner.image?.public_id) {
        await cloudinary.uploader.destroy(banner.image?.public_id);
      }
      const updateImg = await cloudinary.uploader.upload(req.file?.path, {
        resource_type: "image",
        folder: "banner-image",
      });
      banner.image = {
        url: updateImg?.secure_url,
        public_id: updateImg?.public_id,
      };
      fs.unlinkSync(req.file?.path);
    }
    await banner.save();
    return res.json({
      success: true,
      message: "Banner update successfully",
      banner,
    });
  } catch (error) {
    console.log("Banner update error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const singleBanner = asyncHandler(async (req, res) => {
  try {
    const banner = await Banner.findOne({ slug: req.params.slug });
    if (!banner) {
      return res.json({
        success: false,
        message: "Banner slug not match",
      });
    }

    return res.json({
      success: true,
      banner,
    });
  } catch (error) {
    console.log("getting single banner error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const getallBanner = asyncHandler(async (req, res) => {
  try {
    const total = await Banner.countDocuments({});
    const banner = await Banner.find({});
    return res.json({
      success: true,
      total,
      banner,
    });
  } catch (error) {
    console.log("getting all banner error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

export { createBanner, deleteBanner, updateBanner, singleBanner, getallBanner };
