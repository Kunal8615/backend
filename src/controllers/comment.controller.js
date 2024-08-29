import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { Apierror } from "../utils/Apierror.js"
import { Apiresponce } from "../utils/Apiresponce.js";
import {Video }from "../models/video.model.js"
import jwt, { decode } from "jsonwebtoken"
import { asynchandler } from "../utils/Asynchander.js";



const getVideoComments = asynchandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query
    if(!isValidObjectId(videoId)){
        throw new Apierror(400,"Invalid video id")
    }
    const allcommentsinvideo = await Video.aggregate(
        [ {
              $match: {
                _id : new mongoose.Types.ObjectId(videoId)
              }
            },
            {
              $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "video",
                as: "allComment"
              }
            },
            {
              $unwind: "$allComment"
            },
            {
              $project: {
                allComment : 1,
                _id : 0
              }
            }
          ]
    )

if(!allcommentsinvideo){
    throw new Apierror(401, " no comments there")
}

return res.status(200)
.json(new Apiresponce(200, allcommentsinvideo,"fetched all comments of video "))


})

const addComment = asynchandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    if (!videoId || !isValidObjectId(videoId)) {
        throw new Apierror(400, "Video  id not found")
    }
    const video = await Video.findById(videoId)
    if (!content ) {
        throw new Apierror(400, "content not found")
    }
    const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: req.user?._id
    })
    if (!comment) {
        throw new Apierror(404, "Couldnt comment")
    }
    return res.status(200)
        .json(new Apiresponce(200, comment, "Commented Successfully"))
})

const updateComment = asynchandler(async (req, res) => {
    const { commentid } = req.params;
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
        throw new Apierror(400, "Content cannot be empty")
    }
    const verifycomment = await Comment.findById(commentid)
    if (!verifycomment) {
        throw new Apierror(400, " not exist comment")
    }
    if (verifycomment?.owner.toString() !== req.user?._id.toString()) {
        throw new Apierror(400, "Only valid user can update comment")
    }

    const comment = await Comment.findByIdAndUpdate(commentid, {

        $set: {
            content: content
        }
    },
        { new: true }

    )
    if (!comment) {
        throw new Apierror(404, "Couldnt update the comment")
    }
    return res.status(200)
        .json(new Apiresponce(200,comment, "Comment updated successfully"))
})

const deleteComment = asynchandler(async (req, res) => {
    const { commentid } = req.params;
    const comment = await Comment.findById(commentid);
    if (!comment) {
        throw new Apierror(402, "Couldnt find the comment")
    }
    if (comment.owner?.toString() !== req.user?._id.toString()) {
        throw new Apierror(400, "Only the owner can delete comment")
    }
    const newcomment = await Comment.findByIdAndDelete(commentid)
    if (!newcomment) {
        throw new Apierror(500, "Couldnt delete the comment")
    }
    return res.status(200)
        .json(new Apiresponce(200, newcomment, "Comment deleted successfully"))




})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}