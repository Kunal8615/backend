import { Router } from "express";
import {   toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels} from "../controllers/subscription.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router()

router.use(verifyJWT)

router.route("/toggle-subs/:channelId").post(toggleSubscription)
router.route("/channel-subs/:channelId").get(getUserChannelSubscribers)
router.route("/subs-channel/:subscriberId").get(getSubscribedChannels)

export default router