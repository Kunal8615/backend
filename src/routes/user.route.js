import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import verifyJWT from "../middlewares/auth.middleware.js";
import { Registeruser, changeCurrentPassword, changeUserName, getWatchHistory, loginUser, logoutUser, refreshAccessToken,getCurrentUser,getUserChannelProfile,updateUserAvatar,updateUserCoverimage,updateAccountDetail } from "../controllers/user.controller.js"

const 
router = Router();
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    Registeruser
)
router.route("/login").post(loginUser);

//secured routes

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/change-username").post(verifyJWT,changeUserName);
router.route("/update-details").patch(verifyJWT) //update selected by patch
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverimage);
router.route("/com/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);
export default router;

