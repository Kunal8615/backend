import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import User from "../models/user.model.js"
import { Apierror } from "../utils/Apierror.js"
import { Apiresponce } from "../utils/Apiresponce.js"
import { asynchandler } from "../utils/Asynchander.js"

const createTweet = asynchandler(async (req, res) => {
    const {content} = req.body
  //  console.log("req.user:", req.user._id); // Debug log
    
    if (!content ) {
        throw new Apierror(401,"Enter valid content");
    }
   
   if(!isValidObjectId(req.user._id)){
    throw new Apierror(401,"user not registered")
   }

    const tweet = await Tweet.create({
        content : content,
        owner : req.user?._id
    });
    if(!tweet){
        throw new Apierror(500, "Try again later");
    }
    return res.status(200).json(new Apiresponce(200, tweet, "Tweeted successfully"));

})

const getUserTweets = asynchandler(async (req, res) => {
   const {userid} = req.params
   if(!isValidObjectId(userid)){
    throw new Apierror(400,"Invalid user id")
   }
   if(!userid){
    throw new Apierror(400,"User does not exist")
 }

 const user = await User.findById(userid)
 const alltweet = await Tweet.find({
    owner :userid
 })
 if(alltweet.length===0){
    throw new Apierror(400,"No tweets by the user")
 }
 return res.status(200)
     .json(new Apiresponce(200,alltweet,"All tweets fetched successfully"))

})

const updateTweet = asynchandler(async (req, res) => {
   const {tweetid} = req.params
   const {content} = req.body

   if(!mongoose.isValidObjectId(tweetid)){
    throw new Apierror(400, "Invalid tweet ID");
   }

   if(!content && content.trim().length===0){
    throw new Apierror(400,"Content field is empty")
}
const newtweet = await Tweet.findById(tweetid)
if (!newtweet) {
    throw new Apierror(404, "Tweet not found");
}

if (newtweet?.owner.toString() !== req.user?._id.toString()) {
    throw new Apierror(400, "only owner can edit thier tweet");
}
const tweet=await Tweet.findByIdAndUpdate(
    tweetid,
    {
        $set:{
            content:content
        }
    },{new:true}
)

if(!tweet){
    throw new Apierror(500,"Try again later")
}
return res.status(200)
.json(new Apiresponce(200,tweet,"Tweet updated successfully"))
})

const deleteTweet = asynchandler(async (req, res) => {
    const {tweetid} = req.params
    if(!mongoose.isValidObjectId(tweetid)){
        throw new Apierror(400, "Invalid tweet ID");
    }
    const tweet = await Tweet.findById(tweetid);
    if (!tweet) {
        throw new Apierror(404, "Tweet not found");
    }
    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new Apierror(400, "only owner can edit thier tweet");
    }
    
    
    await Tweet.findByIdAndDelete(tweetid)
    
    if(!tweet){
        throw new Apierror(500,"Try again later")
    }
    return res.status(200)
    .json(new Apiresponce(200,{},"Tweet deleted successfully"))
})

const getAllTweets = asynchandler(async (req, res) => {
    const alltweets = await Tweet.aggregate([
      {
        $lookup: {
          from: 'users', 
          localField: 'owner',
          foreignField: '_id',
          as: 'user', 
        },
      },
      {
        $unwind: '$user', 
      },
      {
        $project: {
          _id: 1,
          content: 1,
          createdAt: 1,
          'user.username': 1,
        },
      },
    ]);
  
    return res.status(200).json(new Apiresponce(200, { alltweets }, 'All Tweets fetched'));
  });


export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getAllTweets
}