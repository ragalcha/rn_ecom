// import mongoose from "mongoose";
import dotenv from "dotenv";
import dbConection from "./db/db.js";
import { app } from "./app.js";
const port = 3002
dotenv.config({path: "./env"});
dbConection()
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})