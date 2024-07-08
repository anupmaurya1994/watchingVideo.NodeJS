import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

// Controller function to update a user
export const update = async (req, res, next) => {
  // Check if the user ID in the request matches the authenticated user's ID
  if (req.params.id === req.user.id) {
    try {
      // Find the user by ID and update their information
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body, // Update the user's information with the provided data
        },
        { new: true } // Return the updated user document
      );
      
      // Send a success response with the updated user data
      res.status(200).json(updatedUser);
    } catch (err) {
      // Pass the error to the next middleware function for handling
      next(err);
    }
  } 
  // If the user IDs don't match, pass an error to the next middleware function
  else {
    return next(createError(403, "You can update only your account!"));
  }
};

// Controller function to delete a user
export const deleteUser = async (req, res, next) => {
  // Check if the user ID in the request matches the authenticated user's ID
  if (req.params.id === req.user.id) {
    try {
      // Find the user by ID and delete their account
      await User.findByIdAndDelete(req.params.id);
      
      // Send a success response indicating that the user has been deleted
      res.status(200).json("User has been deleted.");
    } catch (err) {
      // Pass the error to the next middleware function for handling
      next(err);
    }
  } 
  // If the user IDs don't match, pass an error to the next middleware function
  else {
    return next(createError(403, "You can delete only your account!"));
  }
};

// Controller function to get a user
export const getUser = async (req, res, next) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.id);
    
    // Send a success response with the user data
    res.status(200).json(user);
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function to subscribe to a user
export const subscribe = async (req, res, next) => {
  try {
    // Update the authenticated user's subscribedUsers array by pushing the subscribed user's ID
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    
    // Update the subscribed user's subscribers count by incrementing it
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    
    // Send a success response indicating that the subscription was successful
    res.status(200).json("Subscription successful.")
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function to unsubscribe from a user
export const unsubscribe = async (req, res, next) => {
  try {
    // Update the authenticated user's subscribedUsers array by pulling the unsubscribed user's ID
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    
    // Update the unsubscribed user's subscribers count by decrementing it
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });
    
    // Send a success response indicating that the unsubscription was successful
    res.status(200).json("Unsubscription successful.")
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function to like a video
export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  
  try {
    // Update the video by adding the user's ID to the likes array and removing it from the dislikes array
    await Video.findByIdAndUpdate(videoId,{
      $addToSet:{likes:id},
      $pull:{dislikes:id}
    })
    
    // Send a success response indicating that the video has been liked
    res.status(200).json("The video has been liked.")
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function to dislike a video
export const dislike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  
  try {
    // Update the video by adding the user's ID to the dislikes array and removing it from the likes array
    await Video.findByIdAndUpdate(videoId,{
      $addToSet:{dislikes:id},
      $pull:{likes:id}
    })
    
    // Send a success response indicating that the video has been disliked
    res.status(200).json("The video has been disliked.")
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
}
