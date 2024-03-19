import { asyncHandler } from "../utils/asyncHandler.js";
import { Customer } from "../models/customer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

// export
export { registerUser };
