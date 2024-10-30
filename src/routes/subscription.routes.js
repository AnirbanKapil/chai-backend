import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js"
import { toggleSubscription , getUserChannelSubscribers } from "../controllers/subscription.controller.js"

const router = Router();

router.route("/toggle/sub/:channelId").post(verifyJWT,toggleSubscription)
router.route("/c/:channelId").get(verifyJWT,getUserChannelSubscribers)


export default router;