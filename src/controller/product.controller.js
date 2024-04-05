import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Seller } from "../models/seller.model.js";

const addProduct = asyncHandler(async (req, res) => {
	let loggedInSeller;
	if (req.user.userRole === "Seller") {
		loggedInSeller = await Seller.findOne({ customerId: req.user._id });
	} else {
		throw new ApiError(401, "You are not a seller");
	}

	const {
		productId,
		name,
		description,
		price,
		quantity,
		minOrderQuantity,
		maxOrderQuantity,
	} = req.body;

	console.log(
		productId,
		name,
		description,
		price,
		quantity,
		minOrderQuantity,
		maxOrderQuantity
	);

	if (
		!productId ||
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
		sellerId: loggedInSeller._id,
		productId,
		name,
		description,
		price,
		quantity,
		minOrderQuantity,
		maxOrderQuantity,
		productImages: uploadedImagesLink,
	});

	// addding produc id in seller records
	const productsBySeller = loggedInSeller.productPortfolio;
	productsBySeller.push(product._id);

	loggedInSeller.productPortfolio = productsBySeller;
	await loggedInSeller.save({ validateBeforeSave: false });

	return res
		.status(200)
		.json(new ApiResponse(200, product, "product added successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
	if (req.user.userRole !== "Seller") {
		throw new ApiError(401, "You are not a seller");
	}

	const { product_Id } = req.params; // taking productId from url
	const updateFields = req.body;

	try {
		const result = await Product.updateOne(
			{ productId: product_Id }, // Match product by ID
			{ $set: updateFields } // Update only provided fields
		);

		if (result.matchedCount === 0) {
			res.status(404).json({ error: "Product not found" });
		} else {
			res.status(200).json({ message: "Product updated successfully" });
		}
	} catch (error) {
		console.error("Error occurred while updating product:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export { addProduct, updateProduct };
