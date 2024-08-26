import verifyJWT from "../middlewares/auth.middleware.js";
import { Router } from "express";
import {  getChannelStats, 
    getChannelVideos} from "../controllers/dashboard.controller.js"


const router = Router()


router.use(verifyJWT)

router.route("/stats/:channelid").get(getChannelStats)
router.route("/videos/:channelid").get(getChannelVideos);

export default router