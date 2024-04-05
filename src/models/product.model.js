import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
	{
		sellerId: {
			type: Schema.Types.ObjectId,
			ref: "Seller",
		},
		productId: {
			type: Number,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		description: String,
		categories: [
			{
				type: Schema.Types.ObjectId,
				ref: "Category",
			},
		],
		price: {
			type: Number,
			required: true,
		},
		quantity: {
			type: Number,
			default: 0,
		},
		minOrderQuantity: {
			type: Number,
			default: 1,
		},
		maxOrderQuantity: Number,
		stockStatus: {
			type: String,
			enum: ["In Stock", "Out of Stock"],
			default: "In Stock",
		},
		productImages: [String], //cloudinary urls
		relatedProducts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
		],
		status: {
			type: String,
			enum: ["Active", "Inactive"],
			default: "Active",
		},
		isVisible: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
