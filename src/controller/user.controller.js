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
				throw new ApiError(
					400,
					"User with email or username or phone already exists"
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
		throw new ApiError(400, "All fields are required");
	}
});

// login user controller post request api/v1/user/login

const loginUser = asyncHandler(async (req, res) => {
	// take data
	const { email, userName, password } = req.body;

	// username or email
	if (!userName && !email) {
		throw new ApiError(400, "Username or email is required");
	}

	// check whether user exist in customer database or not
	const user = await Customer.findOne({
		$or: [{ email }, { userName }],
	});

	if (!user) {
		throw new ApiError(404, "user does not exist");
	}

	// check if password correct or not
	const isPasswordValid = await user.isPasswordCorrect(password);
	if (!isPasswordValid) {
		throw new ApiError(401, "Invalid user credentials");
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
		const seller = await Seller.findOne({ email: loggedInUser.email });
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

// export
export { registerUser, loginUser, logoutUser };
