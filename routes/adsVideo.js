import express from "express";
import { addAdsVideo, getAdsVideo } from "../controllers/adsVideo.js";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const router = express.Router();

router.post("/", addAdsVideo)
router.get("/findads", getAdsVideo)

export default router;
