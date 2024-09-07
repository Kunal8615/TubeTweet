import mongoose from "mongoose";
import verifyJWT from "../middlewares/auth.middleware.js"
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
    getPlaylistVideos
} from "../controllers/playlist.controller.js"
import { Router } from "express";
const router = Router();
router.use(verifyJWT)

router.route("/").post(createPlaylist)

router.route('/:playlistid').get(getPlaylistById).patch(updatePlaylist).delete(deletePlaylist)
router.route("/video-playlist/:playlistId").get(getPlaylistVideos);
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").delete(removeVideoFromPlaylist);

router.route("/user/:userId").get(getUserPlaylists);
export default router