import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getVideoById, publishAVideo } from "../controllers/video.controller.js";



const router = Router();

router.route("/video-upload").post(verifyJWT,upload.fields([
    {
        name : "videoFile",
        maxCount : 1
    },
    {
        name : "thumbnail",
        maxCount : 1
    }
]),publishAVideo)

router.route("/v/:videoId").get(verifyJWT,getVideoById)


export default router;