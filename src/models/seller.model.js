import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema({}, { timestamps: true });

export const Seller = mongoose.model("Seller", sellerSchema);
