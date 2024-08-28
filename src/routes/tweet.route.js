import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();
import {createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet} from "../controllers/tweet.controller.js"

router.use(verifyJWT)

router.route("/create-tweet").post(createTweet);
router.route("/get-tweet/:username").get(getUserTweets);
router.route("/update-tweet").patch(verifyJWT,updateTweet);
router.route("delete-tweet/:tweetid").delete(deleteTweet)

export default router