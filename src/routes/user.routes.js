import { Router } from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
} from "../controller/user.controller.js";
import multer from "multer";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
// Create a Multer instance specifying the upload destination
const upload = multer({ dest: "uploads/" });

router.route("/register").post(upload.none(), registerUser);
router.route("/login").post(upload.none(), loginUser);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
