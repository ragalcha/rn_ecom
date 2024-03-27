import { Seller } from "../models/seller.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerSeller = asyncHandler(async (req, res) => {
	const {
		companyName,
		businessRegistrationNumber,
		taxIdentificationNumber,
		businessAddress,
		bankName,
		bankAccountNumber,
		IFSC,
	} = req.body;

	console.log(
		companyName,
		businessRegistrationNumber,
		taxIdentificationNumber,
		businessAddress,
		bankName,
		bankAccountNumber,
		IFSC
	);

	if (
		!companyName ||
		!businessRegistrationNumber ||
		!taxIdentificationNumber ||
		!businessAddress ||
		!bankName ||
		!bankAccountNumber ||
		!IFSC
	) {
		throw new ApiError(400, "All seller fields are required");
	}

	const seller = await Seller.create({
		customerId: req.user._id,
		companyName,
		businessRegistrationNumber,
		taxIdentificationNumber,
		businessAddress,
		bankName,
		bankAccountNumber,
		IFSC,
	});

	if (!seller) {
		throw new ApiError(
			500,
			"Something went wrong while registering the seller"
		);
	}

	return res
		.status(200)
		.json(new ApiResponse(200, seller, "Seller registered successfully"));
});

export { registerSeller };
