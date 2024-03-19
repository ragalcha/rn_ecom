import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		companyName: {
			type: String,
		},
		businessRegistrationNumber: {
			type: String,
		},
		taxIdentificationNumber: {
			type: String,
		},
		businessAddress: {
			type: String,
		},
		bankName: {
			type: String,
		},
		bankAccountNumber: {
			type: String,
		},
		IFSC: {
			type: String,
		},
		productCategories: [
			{
				type: Schema.Types.ObjectId,
				ref: "Category",
			},
		],
		productPortfolio: [
			{
				type: Schema.Types.ObjectId,
				ref: "Product",
			},
		],
		accountStatus: {
			type: String,
			enum: ["Active", "Inactive"],
			default: "Active",
		},
		verificationStatus: {
			type: String,
			enum: ["Pending", "Verified", "Rejected"],
			default: "Pending",
		},
	},
	{ timestamps: true }
);

export const Seller = mongoose.model("Seller", sellerSchema);
