import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import verifyJWT from "../middlewares/auth.middleware.js";
import {Registeruser,  loginUser,logoutUser,refreshAccessToken}  from "../controllers/user.controller.js"

const router = Router();
router.route("/register").post(
    upload.fields([
    {
        name : "avatar",
        maxCount: 1
    }, {
        name :"coverimage",
        maxCount : 1
    }
    ]),
    Registeruser
    )

router.route("/login").post(loginUser)

//secured routes

router.route("/logout").post(verifyJWT,logoutUser)
router.route("refresh-token").post(refreshAccessToken)
export default router;

