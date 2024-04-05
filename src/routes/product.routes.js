import { Router } from "express";
import { addProduct } from "../controller/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-product").post(
	verifyJWT,
	upload.fields([
		{
			name: "productImages",
			maxCount: undefined, // Allow multiple files
		},
	]),
	addProduct
);

export default router;
