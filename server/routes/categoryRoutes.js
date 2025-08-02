import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  singleCategory,
  updateCategory,
} from "../controller/categoryController.js";

const categoryRouter = Router();

categoryRouter.post("/createCate", createCategory);
categoryRouter.post("/deleteCate/:id", deleteCategory);
categoryRouter.put("/updateCate/:id", updateCategory);
categoryRouter.get("/singleCate/:slug", singleCategory);
categoryRouter.get("/categories", getAllCategory);

export default categoryRouter;
