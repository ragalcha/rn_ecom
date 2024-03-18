import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},

		userName: {
			type: String,
			required: true,
			unique: true,
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
		addresses: [
			{
				street: String,
				city: String,
				state: String,
				postalCode: String,
				country: String,
			},
		],
		cartItems: [
			{
				type: Schema.Types.ObjectId,
				ref: "Product",
			},
		],
		orders: [
			{
				type: Schema.Types.ObjectId,
				ref: "Order",
			},
		],
		password: {
			type: String,
			required: true,
		},
		userRole: {
			type: String,
			enum: ["Customer", "Admin", "Seller"],
			default: "Customer",
		}
	},
	{ timestamps: true }
);

export const Customer =  mongoose.models.Customer || mongoose.model("Customer", customerSchema);
