import { Router } from "express";
import { getChannelStats } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/stats").get(verifyJWT,getChannelStats);



export default router