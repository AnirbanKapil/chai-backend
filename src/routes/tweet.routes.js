import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet , getUserTweets } from "../controllers/tweet.controller.js";


const router = Router()

router.route("/").post(verifyJWT,createTweet)
router.route("/user/:userId").get(getUserTweets)



export default router;