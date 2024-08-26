import { Router } from "express";
import {   toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels} from "../controllers/subscription.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router()

router.use(verifyJWT)

router.route("/c/:channelid").post(toggleSubscription)
router.route("/c/:channelid").get(getUserChannelSubscribers)
router.route("/c/:subscriberId").get(getSubscribedChannels)

export default router