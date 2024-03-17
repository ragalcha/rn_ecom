import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: String,
		parentCategory: {
			type: Schema.Types.ObjectId,
			ref: "Category",
		},
		subcategories: [
			{
				type: Schema.Types.ObjectId,
				ref: "Category",
			},
		],
		products: [
			{
				type: Schema.Types.ObjectId,
				ref: "Product",
			},
		],
		image: String, // cloudinary url
		isVisible: {
			type: Boolean,
			default: true,
		},
		status: {
			type: String,
			enum: ["Active", "Inactive"],
			default: "Active",
		},
	},
	{ timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
