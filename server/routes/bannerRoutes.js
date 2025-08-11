import { Router } from "express";
import {
  createBanner,
  deleteBanner,
  getallBanner,
  singleBanner,
  updateBanner,
} from "../controller/bannerController.js";
import upload from "../middlewares/multer.js";

const bannerRouter = Router();

bannerRouter.post("/create-banner", upload.single("image"), createBanner);
bannerRouter.post("/delete-banner/:id", deleteBanner);
bannerRouter.put("/update-banner/:id", upload.single("image"), updateBanner);
bannerRouter.get("/single-banner/:slug", singleBanner);
bannerRouter.get("/all-banner", getallBanner);

export default bannerRouter;
