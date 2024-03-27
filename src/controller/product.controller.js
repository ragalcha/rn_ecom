import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";

const addProduct = asyncHandler(async (req, res) => {
	const {
		name,
		description,
		price,
		quantity,
		minOrderQuantity,
		maxOrderQuantity,
	} = req.body;

	console.log(
		name,
		description,
		price,
		quantity,
		minOrderQuantity,
		maxOrderQuantity
	);

	if (
		!name ||
		!description ||
		!price ||
		!quantity ||
		!minOrderQuantity ||
		!maxOrderQuantity
	) {
		throw new ApiError(400, "All Product Fields are required");
	}

	const productImages = req.files["productImages"];
	const uploadedImagesLink = [];

	if (productImages) {
		try {
			// Iterate over each uploaded image file
			for (const image of productImages) {
				// Upload image to Cloudinary
				const uploadedImage = await uploadOnCloudinary(image.path);
				// Store the link in uploadedImagesLink array
				uploadedImagesLink.push(uploadedImage.url);
			}
			// All images uploaded successfully
			console.log(
				"All images uploaded successfully:",
				uploadedImagesLink
			);
		} catch (error) {
			// Handle error if any image upload fails
			console.error("Error uploading images:", error);
		}
	} else {
		console.log("No product images uploaded.");
	}

	const product = await Product.create({
		name,
		description,
		price,
		quantity,
		minOrderQuantity,
		maxOrderQuantity,
		productImages: uploadedImagesLink,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, product, "product added successfully"));
});

export { addProduct };
