import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscription , getUserChannelSubscribers , getSubscribedChannels } from "../controllers/subscription.controller.js"

const router = Router();

router.route("/toggle/sub/:channelId").post(verifyJWT,toggleSubscription)
router.route("/c/:channelId").get(verifyJWT,getUserChannelSubscribers)
router.route("/u/:subscriberId").get(verifyJWT,getSubscribedChannels)


export default router;