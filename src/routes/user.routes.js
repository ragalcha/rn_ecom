import { Router } from "express";
import {
	registerUser,
	loginUser,
	logoutUser,
	takeAddress,
	getUserDetails,
} from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/address").post(verifyJWT, takeAddress);
router.route("/get-user").get(verifyJWT, getUserDetails);

export default router;
