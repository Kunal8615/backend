import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();
import { getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus} from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js";


router.use(verifyJWT);

router.route("/").post(
    upload.fields([
        {
            name : 'videofile',
            maxCount : 1
        },
        {
            name : 'thumbnail',
            maxCount : 1
        }
    ]),
    publishAVideo
);

router.route("/all-videos/:userId").get(getAllVideos);
router
.route("/video-by-id/:videoId").get(getVideoById);
router.route("/delete-video/:videoId").delete(deleteVideo)
router.route("/update-video/:videoId").patch(upload.fields("thumbnail"),updateVideo)
router.route("/toggle/publish/:videoid").patch(togglePublishStatus);
export default router
