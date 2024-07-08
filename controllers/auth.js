import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

// Controller function for user sign-up
// req: The request object containing user data
// res: The response object to send back the result
// next: The next middleware function to handle errors
export const signup = async (req, res, next) => {
  try {
    // Generate a salt for password hashing
    const salt = bcrypt.genSaltSync(10);
    
    // Hash the password using the generated salt
    const hash = bcrypt.hashSync(req.body.password, salt);
    
    // Create a new User instance with the request body data and hashed password
    const newUser = new User({ ...req.body, password: hash });
    
    // Save the new user to the database
    await newUser.save();
    
    // Send a success response indicating that the user has been created
    res.status(200).send("User has been created!");
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function for user sign-in
// req: The request object containing user credentials
// res: The response object to send back the result
// next: The next middleware function to handle errors
export const signin = async (req, res, next) => {
  try {
    // Find a user with the provided name
    const user = await User.findOne({ name: req.body.name });
    
    // If no user is found, pass an error to the next middleware function
    if (!user) return next(createError(404, "User not found!"));
    
    // Compare the provided password with the stored hashed password
    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    
    // If the password is incorrect, pass an error to the next middleware function
    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));
    
    // Generate a JWT token with the user ID
    const token = jwt.sign({ id: user._id }, process.env.JWT);
    
    // Extract the password from the user object and store the remaining data in others
    const { password, ...others } = user._doc;
    
    // Add the token to the others object
    others.token = token;
    
    // Set the access token as a cookie in the response
    res.cookie("access_token", token, {
      httpOnly: true,
    })
      .status(200)
      .json(others);
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function for user logout
// req: The request object
// res: The response object to send back the result
// next: The next middleware function to handle errors
export const logout = async (req, res, next) => {
  try {
    // Clear the access token cookie
    res.clearCookie("access_token");
    
    // Send a success response indicating that the user has been logged out
    res.status(200).send("Logged out successfully!");
  } catch (error) {
    // Pass the error to the next middleware function for handling
    next(error);
  }
}

// Controller function for Google authentication
// req: The request object containing user data from Google
// res: The response object to send back the result
// next: The next middleware function to handle errors
export const googleAuth = async (req, res, next) => {
  try {
    // Find a user with the provided email
    const user = await User.findOne({ email: req.body.email });
    
    // If a user is found, generate a JWT token and send it back as a cookie
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } 
    // If no user is found, create a new user with the provided data and mark it as fromGoogle
    else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      
      // Save the new user to the database
      const savedUser = await newUser.save();
      
      // Generate a JWT token for the saved user
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      
      // Set the access token as a cookie in the response with an expiration time of 30 seconds
      res
        .cookie("access_token", token, {expires: new Date(new Date().getTime() + 30 * 1000),
          sameSite: 'strict',
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
}
