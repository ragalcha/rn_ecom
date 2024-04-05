import { Router } from "express";
import {
	addProduct,
	deleteProduct,
	updateProduct,
} from "../controller/product.controller.js";
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
router.route("/update-product/:product_Id").put(verifyJWT, updateProduct);
router.route("/delete-product/:product_Id").delete(verifyJWT, deleteProduct);

export default router;
