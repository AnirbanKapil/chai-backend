import { Router } from "express";
import { getChannelStats , getChannelVideos } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/stats").get(verifyJWT,getChannelStats);
router.route("/video").get(verifyJWT,getChannelVideos)


export default router