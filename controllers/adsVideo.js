import AdsVideo from "../models/AdsVideo.js";

export const addAdsVideo = async (req, res) => {
    const newAdsVideo = new AdsVideo({ ...req.body });
    try {
      const savedAdsVideo = await newAdsVideo.save();
      res.status(200).json(savedAdsVideo);
    } catch (err) {
        res.status(err).json("something wrong");
    }
  };

  export const getAdsVideo = async (req, res) => {
    try {
    const adsvideo = await AdsVideo.aggregate([{ $sample: { size: 1 } }])
      res.status(200).json(adsvideo);
    } catch (err) {
        res.status(err).json("something wrong");
    }
  };