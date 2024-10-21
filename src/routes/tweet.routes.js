import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet , getUserTweets , updateTweet } from "../controllers/tweet.controller.js";


const router = Router()

router.route("/").post(verifyJWT,createTweet)
router.route("/user/:userId").get(getUserTweets)
router.route("/:tweetId").patch(verifyJWT,updateTweet)


export default router;