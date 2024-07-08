import express from "express";
import { addAdsVideo, getAdsVideo } from "../controllers/adsVideo.js";

const router = express.Router();

router.post("/", addAdsVideo)
router.get("/findads", getAdsVideo)

export default router;