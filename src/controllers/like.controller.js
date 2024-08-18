import { Apierror } from "../utils/Apierror";
import { Apiresponce } from "../utils/Apiresponce";
import { asynchandler } from "../utils/Asynchander";
import { Like } from "../models/like.model";
import mongoose from "mongoose";

const toggleVideoLike = asynchandler(async (req, res) => {
    const {videoId} = req.params
    if(!mongoose.isValidObjectId(videoId)){
        throw new Apierror(400,"Invalid Videoid")
    }

    const videoLikeAlready =await Like.findOne({
        $and : [{video :videoId},{likedby:req.user?._id}]
    })

    if(videoLikeAlready){
        await Like.findByIdAndDelete(
            videoLikeAlready?._id
        )
    }
    else{
        await Like.create({
            video:videoId,
            likedby:req.user?._id
        })
    }
    return res.status(200)
    .json(new Apiresponce(200,{},"Liked already"))
})

const toggleCommentLike = asynchandler(async (req, res) => {
    const {commentId} = req.params
   if(!mongoose.isValidObjectId(commentId)){
    throw new Apierror(404,"Comment id is invalid")
   }
   const comment = await Like.findOne({
    $and :[{comment:commentId},{likedby:req.user?._id}]
   })
   if(comment){
    await Like.findByIdAndDelete(comment?._id)
   }

   else{
    await Like.create({
        comment:commentId,
        likedby:req.user?._id
    })
}
return res.status(200)
.json(new Apiresponce(200,{},"Comment liked successfully"))

})

const toggleTweetLike = asynchandler(async (req, res) => {
    const {tweetId} = req.params
   if(!mongoose.isValidObjectId(tweetId)){
    throw new Apierror(404,"tweet id is invalid")
   }

   const tweet = await Like.findOne({
    $and:[{tweet:tweetId},{likedby:req.user?._id}]
   })

   if(tweet){
    await Like.findByIdAndDelete(tweet._id)
   }
   else{
    await Like.create({
        tweet : tweetId,
        likedby : req.user._id
    })
   }
}
)

const getLikedVideos = asynchandler(async (req, res) => {
   const likedvideos = await Like.aggregate([

    {
        $match : {
            likedby : req.user?._id
        }
    },
    {
        $lookup : {
            from : "videos",
            localField: "video",
            foreignField : "_id",
            as : "like"
        }
    },
    {
        $addFields : {
            totallikedbyuser : {
                $size : "$like"
            }
        }
    },{
        $project : {
            likedby:1,
            totallikedbyuser:1,
            like:1
        }
    }
   ])

   if(!likedvideos || likedvideos.length ===0){
    throw new Apierror(404, "Couldn't find liked videos");
   }

   return res.status(200)
   .json(new Apiresponce(200,{likedVideos},"Fetched all the liked video successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}