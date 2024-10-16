import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getVideoById, publishAVideo, updateVideo } from "../controllers/video.controller.js";



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
router.route("/v/:videoId").patch(verifyJWT,upload.single("thumbnail"),updateVideo)
router.route("/v/:videoId").delete(verifyJWT,deleteVideo)

export default router;
