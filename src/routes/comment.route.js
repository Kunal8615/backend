import { Router } from 'express';
import verifyJWT from '../middlewares/auth.middleware.js';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"


const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/get-video-comments/:videoId").get(getVideoComments);
router.route("/add-comment/:videoId").post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);


export default router