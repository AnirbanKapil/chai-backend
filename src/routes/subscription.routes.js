import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js"
import { toggleSubscription } from "../controllers/subscription.controller.js"

const router = Router();

router.route("/toggle/sub/:channelId").post(verifyJWT,toggleSubscription)


export default router;