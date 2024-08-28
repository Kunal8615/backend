import { Apierror } from "../utils/Apierror.js"
import { Apiresponce } from "../utils/Apiresponce.js";
import { asynchandler } from "../utils/Asynchander.js";
import { Like } from "../models/like.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const toggleVideoLike = asynchandler(async (req, res) => {
    const { videoid } = req.params;

    if (!mongoose.isValidObjectId(videoid)) {
        throw new Apierror(400, "Invalid Video ID");
    }

    // Check if the video is already liked by the user
    const videoLikeAlready = await Like.findOne({
        video: videoid,
        LikedBy: req.user._id
    });

    if (videoLikeAlready) {
        // If liked already, remove the like (dislike)
        await Like.findByIdAndDelete(videoLikeAlready?._id);

        return res.status(201)
            .json(new Apiresponce(200, {}, "Video disliked successfully"));
    } else {
        // If not liked, create a new like
        await Like.create({
            video: videoid,
            LikedBy: req.user._id
        });

        return res.status(200)
            .json(new Apiresponce(200, {}, "Video liked successfully"));
    }
});


const toggleCommentLike = asynchandler(async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new Apierror(404, "Comment ID is invalid");
    }

    // Check if the comment is already liked by the user
    const commentLikeAlready = await Like.findOne({
        comment: commentId,
        LikedBy: req.user._id // Ensure correct field name
    });

    if (commentLikeAlready) {
        // If liked already, remove the like (dislike)
        await Like.findByIdAndDelete(commentLikeAlready._id);

        return res.status(200)
            .json(new Apiresponce(200, {}, "Comment disliked successfully"));
    } else {
        // If not liked, create a new like
        await Like.create({
            comment: commentId,
            LikedBy: req.user._id // Ensure correct field name
        });

        return res.status(200)
            .json(new Apiresponce(200, {}, "Comment liked successfully"));
    }
});


const toggleTweetLike = asynchandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new Apierror(400, "Invalid Video ID");
    }

    // Check if the video is already liked by the user
    const tweetLikeAlready = await Like.findOne({
        tweet: tweetId,
        LikedBy: req.user._id
    });

    if (tweetLikeAlready) {
        // If liked already, remove the like (dislike)
        await Like.findByIdAndDelete(tweetLikeAlready?._id);

        return res.status(201)
            .json(new Apiresponce(200, {}, "tweet disliked successfully"));
    } else {
        // If not liked, create a new like
        await Like.create({
            tweet: tweetId,
            LikedBy: req.user._id
        });

        return res.status(200)
            .json(new Apiresponce(200, {}, "tweet liked successfully"));
    }
}
)

const getLikedVideos = asynchandler(async (req, res) => {
    const likedVideos = await Like.aggregate([
        {
            $match: {
                LikedBy: req.user?._id // Ensure correct field name
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideo"
            }
        },
        {
            $unwind: "$likedVideo"
        },
        {
            $project: {
                _id: 0, // Exclude the _id field from the Like collection
                likedVideo: 1 // Include the liked video details
            }
        }
    ]);

    if (!likedVideos || likedVideos.length === 0) {
        throw new Apierror(404, "Couldn't find liked videos");
    }

    return res.status(200)
        .json(new Apiresponce(200, likedVideos, "Fetched all the liked videos successfully"));
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}