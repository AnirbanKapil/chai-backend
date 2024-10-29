import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist , deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";


const router = Router();

router.route("/").post(verifyJWT,createPlaylist);

router.route("/user/:userId").get(verifyJWT,getUserPlaylists);
router.route("/:playlistId").get(verifyJWT,getPlaylistById);
router.route("/add/:videoId/:playlistId").patch(verifyJWT,addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").patch(verifyJWT,removeVideoFromPlaylist);
router.route("/:playlistId").delete(verifyJWT,deletePlaylist)
router.route("/:playlistId").patch(verifyJWT,updatePlaylist)


export default router;

