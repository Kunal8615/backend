import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware"
const router = Router();
import {createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet} from "../controllers/tweet.controller"

router.use(verifyJWT)


router.route("/create-tweet").post(createTweet);
router.route("/get-tweet/:username").get(getUserTweets);
router.route("/update-tweet").post(verifyJWT,updateTweet);
router.route("delete-tweet/:tweetid").post(deleteTweet)