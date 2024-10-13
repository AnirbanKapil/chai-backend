import {Router} from "express"
import {getVideoComments} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router = Router();

route.use(verifyJWT);

router.route("/:videoId").get(getVideoComments);

export default router;
