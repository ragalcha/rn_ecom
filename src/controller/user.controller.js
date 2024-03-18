import { asyncHandler } from "../utils/asyncHandler.js";
import { Customer } from "../models/customer.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// register user controller post request api/v1/user/register
const registerUser = asyncHandler( async (req, res) => {

    // access data from the form-data 
    const [firstName,lastName,userName,email,phone,password,street,city,state,postalCode,country] = [req.body.firstName,req.body.lastName,req.body.userName,req.body.email,req.body.phone,req.body.password,req.body.street,req.body.city,req.body.state,req.body.postalCode,req.body.country];
    const address ={
        street,
        city,
        state,
        postalCode,
        country
    };
    console.log(firstName,lastName,userName,email,phone,password,street,city,state,postalCode,country,address);
    if(firstName && lastName && userName && email && phone && address && password){
      try { 
        // check user exist or not   
        const existingUser = await Customer.findOne({
                $or: [
                    { userName: userName },
                    { email: email },
                    { phone: phone }
                ]
            });
            
            if (existingUser) {
                // User with the provided username, email, or phone number already exists
                // Handle the case accordingly, such as returning an error response
                return res.status(400).send("User already exists");
            }
          //password hashing
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          // create new customer 
          const customer =  new Customer({
              firstName,
              lastName,
              userName,
              email,
              phone,
              addresses: [
                {
                    street: street,
                    city: city,
                    state: state,
                    postalCode: postalCode,
                    country: country,
                },
            ],
              password:hashedPassword
          })
          const result = await customer.save();
          return res.status(200).json({ message: 'user resgiter successfully', data: result });
      } catch (error) {
        console.log("register error",error);
      }
    }else{
        return res.status(400).json({ error: 'All fields are required' });
    }
})

// login user controller post request api/v1/user/login


// export
export {
    registerUser,
}