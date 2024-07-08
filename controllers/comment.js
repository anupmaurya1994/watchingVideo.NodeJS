import { createError } from "../error.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

// Controller function to add a new comment
export const addComment = async (req, res, next) => {
  // Create a new Comment instance with the request body data and the user ID
  const newComment = new Comment({ ...req.body, userId: req.user.id });
  
  try {
    // Save the new comment to the database
    const savedComment = await newComment.save();
    
    // Send a success response with the saved comment data
    res.status(200).send(savedComment);
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function to delete a comment
export const deleteComment = async (req, res, next) => {
  try {
    // Find the comment by its ID
    const comment = await Comment.findById(req.params.id);
    
    // Find the video associated with the comment by its ID
    const video = await Video.findById(req.params.videoId);
    
    // Check if the user is the owner of the comment or the video
    if (req.user.id === comment.userId || req.user.id === video.userId) {
      // Delete the comment from the database
      await Comment.findByIdAndDelete(req.params.id);
      
      // Send a success response indicating that the comment has been deleted
      res.status(200).json("The comment has been deleted.");
    } 
    // If the user is not the owner, pass an error to the next middleware function
    else {
      return next(createError(403, "You can delete only your comment!"));
    }
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function to get comments for a specific video
export const getComments = async (req, res, next) => {
  try {
    // Find all comments associated with the specified video ID
    const comments = await Comment.find({ videoId: req.params.videoId });
    
    // Send a success response with the comments data
    res.status(200).json(comments);
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
}
