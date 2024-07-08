import AdsVideo from "../models/AdsVideo.js";

// Controller function to add a new ads video
export const addAdsVideo = async (req, res) => {
    // Create a new AdsVideo instance with the request body data
    const newAdsVideo = new AdsVideo({ ...req.body });
    
    try {
      // Save the new ads video to the database
      const savedAdsVideo = await newAdsVideo.save();
      
      // Return a success response with the saved ads video data
      res.status(200).json(savedAdsVideo);
    } catch (err) {
        // If an error occurs, return an error response with the error message
        res.status(err).json("something wrong");
    }
  };

  // Controller function to get a random ads video
  export const getAdsVideo = async (req, res) => {
    try {
      // Fetch a random ads video using the aggregate method with a $sample stage
      const adsvideo = await AdsVideo.aggregate([{ $sample: { size: 1 } }])
      
      // Return a success response with the random ads video data
      res.status(200).json(adsvideo);
    } catch (err) {
        // If an error occurs, return an error response with the error message
        res.status(err).json("something wrong");
    }
  }
