import mongoose from "mongoose";
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchander.js";
import { Video } from "../models/video.model.js";
import { Apiresponce } from "../utils/Apiresponce.js";
import User from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";


const getChannelStats = asynchandler(async (req, res) => {
    const { channelid } = req.params;

    if (!mongoose.isValidObjectId(channelid)) {
        throw new Apierror(200, "Channel not found");
    }

    // Subscribers count
    const countSubscriber = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelid)
            }
        },
        {
            $count: "count"
        }
    ]);

    if (!countSubscriber || countSubscriber.length === 0) {
        // If no subscribers found, set totalSubscribers to 0
        var totalSubscribers = 0;
    } else {
        var totalSubscribers = countSubscriber[0].count;
    }

    // Videos count
    const countVideo = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelid)
            }
        },
        {
            $count: "count"
        }
    ]);

    if (!countVideo || countVideo.length === 0) {
        // If no videos found, set totalVideos to 0
        var totalVideos = 0;
    } else {
        var totalVideos = countVideo[0].count;
    }

    // Total Views count
    const totalViews = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelid)
            }
        },
        {
            $project: {
                views: 1,
                _id: 0
            }
        }
    ]);

    if (!totalViews || totalViews.length === 0) {
        // If no views found, set totalNumberOfViews to 0
        var totalNumberOfViews = 0;
    } else {
        var totalNumberOfViews = totalViews.reduce((acc, viewObj) => acc + viewObj.views, 0);
    }

    return res.status(200).json(
        new Apiresponce(
            200,
            {
                totalNumberOfSubscribers: totalSubscribers,
                totalNumberOfViews,
                totalNumberOfVideos: totalVideos
            },
            "Data fetched"
        )
    );
});





const getChannelVideos = asynchandler(async (req, res) => {
    const { channelid } = req.params
    if (!channelid && mongoose.isValidObjectId(channelid)) {
        throw new Apierror(401, "Invalid user Id")
    }

    const channelvideos = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(channelid)
            }
        },

        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "video"
            }
        },
        {
            $project: {
                video: 1,
                _id: 0
            }
        },
        {
            $unwind: "$video"
        }
    ])

    if (!channelvideos) {
        return res
            .status(200)
            .json(
                new Apiresponce(
                    200,
                    {},
                    "User does't uploaded any videos"
                )
            )
    }

    return res
        .status(200)
        .json(
            new Apiresponce(
                200,
                channelvideos,
                "User videos fetched"
            )
        )

})

export {
    getChannelStats,
    getChannelVideos
}