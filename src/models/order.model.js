import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
	{
		orderDate: {
			type: Date,
			default: Date.now,
		},
		customerId: {
			type: Schema.Types.ObjectId,
			ref: "Customer",
		},
		billingAddress: {
			type: String,
			required: true,
		},
		shippingAddress: {
			type: String,
			required: true,
		},
		shippingMethod: String,
		shippingCost: Number,
		paymentMethod: String,
		transactionId: String,
		paymentStatus: {
			type: String,
			enum: ["Pending", "Completed", "Refunded"],
			default: "Pending",
		},
		orderItems: [
			{
				productId: { type: Schema.Types.ObjectId, ref: "Product" },
				productName: String,
				quantity: Number,
				price: Number,
				totalPrice: Number,
				variants: [String],
				subtotal: Number,
			},
		],
		orderStatus: {
			type: String,
			enum: ["Processing", "Shipped", "Delivered"],
			default: "Processing",
		},
		trackingNumber: String,
		estimatedDeliveryDate: Date,
		returnStatus: {
			type: String,
			enum: ["Pending", "Approved", "Rejected"],
			default: "Pending",
		},
	},
	{ timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
