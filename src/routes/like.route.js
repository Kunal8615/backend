import { toggleCommentLike ,toggleTweetLike,
    toggleVideoLike,getLikedVideos} from "../controllers/like.controller.js";
import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/toggle-video/:videoid").post(toggleVideoLike);
router.route("/toggle/v/:channelid").post(toggleCommentLike);
router.route("/toggle/v/:tweetid").post(toggleTweetLike);
router.route("/all-liked-video/:userid")

export default router
