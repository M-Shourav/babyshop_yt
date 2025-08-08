import { Router } from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  singleBrand,
  updateBrand,
} from "../controller/brandsController.js";
import upload from "../middlewares/multer.js";

const brandRouter = Router();

brandRouter.post("/createBrand", upload.single("images"), createBrand);
brandRouter.post("/deleteBrand/:id", deleteBrand);
brandRouter.get("/singleBrand/:slug", singleBrand);
brandRouter.get("/brands", getAllBrand);
brandRouter.put("/updateBrand/:id", upload.single("images"), updateBrand);

export default brandRouter;
