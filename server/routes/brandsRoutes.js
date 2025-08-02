import { Router } from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  singleBrand,
  updateBrand,
} from "../controller/brandsController.js";

const brandRouter = Router();

brandRouter.post("/createBrand", createBrand);
brandRouter.post("/deleteBrand/:id", deleteBrand);
brandRouter.get("/singleBrand/:slug", singleBrand);
brandRouter.get("/brands", getAllBrand);
brandRouter.put("/updateBrand/:id", updateBrand);

export default brandRouter;
