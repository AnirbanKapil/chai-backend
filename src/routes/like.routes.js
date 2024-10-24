import { Router } from "express";
import { toggleCommentLike, toggleVideoLike } from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/toggle/v/:videoId").post(verifyJWT,toggleVideoLike);
router.route("/toggle/v/:commentId").post(verifyJWT,toggleCommentLike)

export default router