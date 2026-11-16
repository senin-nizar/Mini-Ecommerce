import express from "express";
import {createProduct,getProducts} from "../controllers/ProductsController.js";
import upload from "../middleware/upload.js";


const router = express.Router();
router.post("/", upload.single("image"), createProduct);
router.get("/", getProducts);

export default router;  