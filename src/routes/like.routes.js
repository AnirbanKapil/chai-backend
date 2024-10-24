import { Router } from "express";
import { toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/toggle/v/:videoId").post(verifyJWT,toggleVideoLike);
router.route("/toggle/c/:commentId").post(verifyJWT,toggleCommentLike)
router.route("/toggle/t/:tweetId").post(verifyJWT,toggleTweetLike)

export default router