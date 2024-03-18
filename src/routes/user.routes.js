import { Router } from "express";
import { registerUser} from "../controller/user.controller.js";
import multer from "multer";


const router = Router();
// Create a Multer instance specifying the upload destination
const upload = multer({ dest: 'uploads/' });

router.route("/register").post( upload.none(),registerUser)

export default router