import { Router } from "express";
import {
  allProducts,
  createProducts,
  deleteProducts,
  singleProducts,
  updateProducts,
} from "../controller/productController.js";
import upload from "../middlewares/multer.js";

const productRouter = Router();

productRouter.post("/add-product", upload.array("images", 3), createProducts);
productRouter.post("/delete-product/:id", deleteProducts);
productRouter.put(
  "/update-product/:id",
  upload.array("images", 3),
  updateProducts
);
productRouter.get("/single-product/:slug", singleProducts);
productRouter.get("/all-product", allProducts);

export default productRouter;
