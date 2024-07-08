import User from "../models/User.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";

// Controller function to add a new video
export const addVideo = async (req, res, next) => {
  // Create a new Video instance with the user ID and request body data
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  
  try {
    // Save the new video to the database
    const savedVideo = await newVideo.save();
    
    // Send a success response with the saved video data
    res.status(200).json(savedVideo);
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function to update a video
export const updateVideo = async (req, res, next) => {
  try {
    // Find the video by ID
    const video = await Video.findById(req.params.id);
    
    // If the video is not found, pass an error to the next middleware function
    if (!video) return next(createError(404, "Video not found!"));
    
    // Check if the user ID matches the video's user ID
    if (req.user.id === video.userId) {
      // Find the video by ID and update its information
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body, // Update the video's information with the provided data
        },
        { new: true } // Return the updated video document
      );
      
      // Send a success response with the updated video data
      res.status(200).json(updatedVideo);
    } 
    // If the user ID doesn't match, pass an error to the next middleware function
    else {
      return next(createError(403, "You can update only your video!"));
    }
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function to delete a video
export const deleteVideo = async (req, res, next) => {
  try {
    // Find the video by ID
    const video = await Video.findById(req.params.id);
    
    // If the video is not found, pass an error to the next middleware function
    if (!video) return next(createError(404, "Video not found!"));
    
    // Check if the user ID matches the video's user ID
    if (req.user.id === video.userId) {
      // Find the video by ID and delete it
      await Video.findByIdAndDelete(req.params.id);
      
      // Send a success response indicating that the video has been deleted
      res.status(200).json("The video has been deleted.");
    } 
    // If the user ID doesn't match, pass an error to the next middleware function
    else {
      return next(createError(403, "You can delete only your video!"));
    }
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function to get a video
export const getVideo = async (req, res, next) => {
  try {
    // Find the video by ID
    const video = await Video.findById(req.params.id);
    
    // Send a success response with the video data
    res.status(200).json(video);
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function to add a view to a video
export const addView = async (req, res, next) => {
  try {
    // Find the video by ID and increment its views count by 1
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    
    // Send a success response indicating that the view has been increased
    res.status(200).json("The view has been increased.");
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function to get random videos
export const random = async (req, res, next) => {
  try {
    // Fetch 40 random videos using the aggregate method with a $sample stage
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    
    // Send a success response with the random videos data
    res.status(200).json(videos);
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function to get trending videos
export const trend = async (req, res, next) => {
  try {
    // Find all videos and sort them by views in descending order
    const videos = await Video.find().sort({ views: -1 });
    
    // Send a success response with the trending videos data
    res.status(200).json(videos);
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function to get subscribed videos
export const sub = async (req, res, next) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.user.id);
    
    // Get the user's subscribed channels
    const subscribedChannels = user.subscribedUsers;
    
    // Fetch videos from the subscribed channels using Promise.all
    const list = await Promise.all(
      subscribedChannels.map(async (channelId) => {
        return await Video.find({ userId: channelId });
      })
    );
    
    // Flatten the list of videos and sort them by creation date in descending order
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function to get videos by tags
export const getByTag = async (req, res, next) => {
  // Split the tags query parameter by comma
  const tags = req.query.tags.split(",");
  
  try {
    // Find videos that have any of the specified tags and limit the result to 20
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    
    // Send a success response with the videos data
    res.status(200).json(videos);
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
};

// Controller function to search for videos
export const search = async (req, res, next) => {
  // Get the search query from the request
  const query = req.query.q;
  
  try {
    // Find videos with titles matching the search query and limit the result to 40
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    
    // Send a success response with the search results
    res.status(200).json(videos);
  } catch (err) {
    // Pass the error to the next middleware function for handling
    next(err);
  }
}
