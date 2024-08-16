import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import { Apierror } from "../utils/Apierror.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asyncHandler.js"

const createTweet = asynchandler(async (req, res) => {
    const {content} = req.body
    if (!content || content.trim().length === 0) {
        throw new Apierror("Enter valid content");
    }
    console.log("req.user:", req.user); // Debug log
    const user = await User.findById(req.user?._id);
    console.log("User found:", user); // Debug log
    if (!user) {
        throw new Apierror(400, "Couldn't find the user");
    }

    const tweet = await Tweet.create({
        content : content,
        owner : req._id
    });
    if(!tweet){
        throw new Apierror(500, "Try again later");
    }
    return res.status(200).json(new Apisuccess(200, "Tweeted successfully", tweet));

})

const getUserTweets = asynchandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asynchandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asynchandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}