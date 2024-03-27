import { Router } from "express";
import { addProduct } from "../controller/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add-product").post(
	upload.fields([
		{
			name: "productImages",
			maxCount: undefined, // Allow multiple files
		},
	]),
	addProduct
);

export default router;
