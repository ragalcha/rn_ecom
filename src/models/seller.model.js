import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		companyName: String,
		businessRegistrationNumber: String,
		taxIdentificationNumber: String,
		businessAddress: String,
		bankName: String,
		bankAccountNumber: String,
		IFSC: String,
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
