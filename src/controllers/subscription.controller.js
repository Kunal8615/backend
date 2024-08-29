import mongoose, {isValidObjectId} from "mongoose"
import User from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Apierror } from "../utils/Apierror.js"
import {Apiresponce} from "../utils/Apiresponce.js"
import { asynchandler } from "../utils/Asynchander.js"


const toggleSubscription = asynchandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId && !isValidObjectId(channelId)){
        throw new Apierror(401,"channel is invalid")
    }

    const checkChannelSubsOrNot = await Subscription.findOne({
        channel : channelId,
        subscriber : req.user?._id
    })

    if(checkChannelSubsOrNot){
        await Subscription.deleteOne({
            channel : channelId,
            subscriber : req.user?._id
        })

        return res.status(200).json(new Apiresponce(200, null, "Unsubscribed"));
    }

    else{
        const subscriberd = await Subscription.create({
            channel : channelId,
            subscriber : req.user?._id
        })
        return res.status(200).json(new Apiresponce(200, subscriberd, "Subscribed "));
    }


})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynchandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId && !isValidObjectId(channelId)){
        throw new Apierror(401,"channel is invalid")
    }

    const subscribers = await Subscription.aggregate([
        {
            $match : {
                channel : new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group : {
                _id : "$subscriber"
            }
        }
    ])
    if (!subscribers) {
        throw new Apierror(300 , "subscribers not found")
    }

    return res
    .status(200)
    .json(
        new Apiresponce(
            200,
            subscribers,
            "subscribers fetched sucessfully"
        )
    )

})


const getSubscribedChannels = asynchandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!subscriberId && !isValidObjectId(subscriberId)){
        throw new Apierror(401,"channel is invalid")
    }

    const subscribedChannel = await Subscription.aggregate([
        {
            $match : {
                subscriber :  new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $group : {
                _id : "$channel"
            }
        }
    ])

    if (!subscribedChannel) {
        throw new Apierror(300 , "subscribed channel not found")
    }

    return res
    .status(200)
    .json(
        new Apiresponce(
            200,
            subscribedChannel,
            "subscribed channel fetched sucessfully"
        )
    )

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}