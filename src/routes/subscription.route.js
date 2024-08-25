import { Router } from "express";
import {   toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels} from "../controllers/subscription.controller"
import verifyJWT from "../middlewares/auth.middleware";
const router = Router()

router.use(verifyJWT)

router.route("/c/:channelid").post(toggleSubscription)
router.route("/c/:channelid").get(getUserChannelSubscribers)
router.route("/c/:subscriberId").get(getSubscribedChannels)

export default router