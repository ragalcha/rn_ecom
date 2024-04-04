import { asyncHandler } from "../utils/asyncHandler.js";
import { Customer } from "../models/customer.model.js";
import { Seller } from "../models/seller.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { OPTIONS } from "../constants.js";
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js";

// register user controller post request api/v1/user/register
const registerUser = asyncHandler(async (req, res) => {
	// access data from the form-data
	const [firstName, lastName, userName, email, phone, password] = [
		req.body.firstName,
		req.body.lastName,
		req.body.userName,
		req.body.email,
		req.body.phone,
		req.body.password,
	];
    console.log(firstName, lastName, userName, email, phone, password);
	if (firstName && lastName && userName && email && phone && password) {
		try {
			// check user exist or not
			const existingUser = await Customer.findOne({
				$or: [
					{ userName: userName },
					{ email: email },
					{ phone: phone },
				],
			});

			if (existingUser) {
				// User with the provided username, email, or phone number already exists
				// Handle the case accordingly, such as returning an error response
				return res
				.status(401)
				.json(
					new ApiResponse(
						401,
						existingUser,
						"User with email or username or phone already exists"
					)
				);
			}

			// create new customer
			const customer = new Customer({
				firstName,
				lastName,
				userName,
				email,
				phone,
				password,
			});
			const result = await customer.save();
			const createdUser = await Customer.findById(result._id).select(
				"-password -refreshToken"
			);

			// checking if user created or not
			if (!createdUser) {
				throw new ApiError(
					500,
					"Something went wrong while registering the user"
				);
			}

			// return res
			return res
				.status(201)
				.json(
					new ApiResponse(
						200,
						createdUser,
						"User Registered Successfully"
					)
				);
		} catch (error) {
			throw new ApiError(400, error.message);
		}
	} else {
		return res
				.status(401)
				.json(
					new ApiResponse(
						401,
						 "",
						"All field are required"
					)
				);
	}
});

// login user controller post request api/v1/user/login

const loginUser = asyncHandler(async (req, res) => {
	// take data
	const { email, userName, password } = req.body;
//    console.log("i am email-->",email,req.body.email);
//    console.log("i am user name-->",userName,req.body.userName);
//    console.log("i am password-->",password,req.body.password);
// 	// username or email
	if (!userName && !email) {
		// console.log("username or email is required");
		return res
		.status(401)
		.json(
			new ApiResponse(
				401,
				"",
				"Username or email is required"
			)
		);
	}

	// check whether user exist in customer database or not
	const user = await Customer.findOne({
		$or: [{ email }, { userName }],
	});

	if (!user) {
		return res
		.status(401)
		.json(
			new ApiResponse(
				401,
				"",
				"Invalid user credentials: user not exit"
			)
		);
	}
	// check if password correct or not
	const isPasswordValid = await user.isPasswordCorrect(password);
	if (!isPasswordValid) {
		return res
		.status(401)
		.json(
			new ApiResponse(
				401,
				"",
				"Invalid user credentials: wrong password"
			)
		);
	}

	// access token and refresh token
	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
		user._id
	);
	const loggedInUser = await Customer.findById(user._id).select(
		"-password -refreshToken"
	);

	const allDetails = [loggedInUser];

	// check if user is a seller
	if (loggedInUser.userRole === "Seller") {
		const seller = await Seller.findOne({ customerId: loggedInUser._id });
		if (seller) {
			allDetails.push(seller);
		}
	}

	// if user is seller then send data of both customer and seller if not then send data of customer only
	return res
		.status(200)
		.cookie("accessToken", accessToken, OPTIONS)
		.cookie("refreshToken", refreshToken, OPTIONS)
		.json(
			new ApiResponse(
				200,
				{
					user: allDetails,
					accessToken,
					refreshToken,
				},
				"User logged in successfully"
			)
		);
});

const logoutUser = asyncHandler(async (req, res) => {
	// here we removed refresh token from the database
	await Customer.findByIdAndUpdate(
		req.user._id,
		{
			$unset: {
				refreshToken: 1, // this removes the field from document
			},
		},
		{
			new: true,
		}
	);

	// here we cleared tokens from cookies
	return res
		.status(200)
		.clearCookie("accessToken", OPTIONS)
		.clearCookie("refreshToken", OPTIONS)
		.json(new ApiResponse(200, {}, "User logged out"));
});

// address controller
const takeAddress = asyncHandler(async (req, res) => {
	// take input
	const { street, city, state, postalCode, country } = req.body;
	console.log(street, city, state, postalCode, country);
	if (!street || !city || !state || !postalCode || !country) {
		throw new ApiError(400, "All address fields are required");
	}

	// save to database
	const newAddress = {
		street,
		city,
		state,
		postalCode,
		country,
	};

	const updatedUser = await Customer.findOneAndUpdate(
		{ _id: req.user._id }, // Query to find the user by ID
		{ $push: { addresses: newAddress } }, // Update to push the new address
		{ new: true } // Return the updated document
	);

	// send response
	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				updatedUser.addresses,
				"Address added successfully"
			)
		);
});

const getUserDetails = asyncHandler(async (req, res) => {
	const user = await Customer.findById(req.user._id).select(
		"-password -refreshToken"
	);

	const allDetails = [user];

	// check if user is a seller
	if (user.userRole === "Seller") {
		const seller = await Seller.findOne({ customerId: user._id });
		if (seller) {
			allDetails.push(seller);
		}
	}

	return res.status(200).json(
		new ApiResponse(
			200,
			{
				user: allDetails,
			},
			"User details fetched successfully"
		)
	);
});

// export
export { registerUser, loginUser, logoutUser, takeAddress, getUserDetails };
