// import mongoose from "mongoose";
import dotenv from "dotenv";
import dbConection from "./db/db.js";
import { app } from "./app.js";



dotenv.config({ path: "./env" });

dbConection();
app.listen(process.env.PORT, () => {
	console.log(`Example app listening on port ${process.env.PORT}`);
});
