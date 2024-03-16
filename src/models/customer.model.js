import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema({}, { timestamps: true });

export const Customer = mongoose.model("Customer", customerSchema);
