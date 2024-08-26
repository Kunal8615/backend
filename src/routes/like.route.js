import { toggleCommentLike ,toggleTweetLike,
    toggleVideoLike,getLikedVideos} from "../controllers/like.controller.js";
import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/toggle/v/:videoid").post(toggleVideoLike);
router.route("/toggle/v/:channelid").post(toggleCommentLike);
router.route("/toggle/v/:tweetid").post(toggleTweetLike);

export default router
