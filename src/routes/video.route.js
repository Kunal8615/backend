import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
const router = Router();
import { getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus} from "../controllers/video.controller"
import { upload } from "../middlewares/multer.middleware";


router.use(verifyJWT);

router.route("/").get(getAllVideos).post(
    upload.fields([
        {
            name : 'videofile',
            maxCount : 1
        },
        {
            name : thumbnail,
            maxCount : 1
        }
    ]),
    publishAVideo
);

router
.route("/:videoid").get(getVideoById).delete(deleteVideo).patch(upload.fields("thumbnail"),updateVideo);

router.route("/toggle/publish/:videoid").patch(togglePublishStatus);
export default router
