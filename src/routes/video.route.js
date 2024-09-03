import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();
import { getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    getAllUsersVideos,
    deleteVideo,
    togglePublishStatus,
getUserByVideoId} from "../controllers/video.controller.js"
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
router
.route("/videoall-video").get(getAllUsersVideos);
router.route("/delete-video/:videoId").delete(deleteVideo)
router.route("/update-video/:videoId").patch(upload.fields([
    {
        name : "thumbnail",
        maxCount : 1
    }
]),updateVideo)

router.route("/toggle/publish/:videoid").patch(togglePublishStatus);
router.route("/get-user-by-video-id/:videoId").get(getUserByVideoId);


export default router
