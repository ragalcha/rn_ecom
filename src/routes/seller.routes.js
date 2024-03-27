import { Router } from "express";
import { registerSeller } from "../controller/seller.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(verifyJWT, registerSeller);

export default router;
