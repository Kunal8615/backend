import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();
import {createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet} from "../controllers/tweet.controller.js"

router.use(verifyJWT)

router.route("/create-tweet").post(createTweet);
router.route("/get-tweet/:userid").get(getUserTweets);
router.route("/update-tweet/:tweetid").patch(updateTweet);
router.route("/delete-tweet/:tweetid").delete(deleteTweet);

export default router