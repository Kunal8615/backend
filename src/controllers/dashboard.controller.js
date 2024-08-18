import mongoose from "mongoose";
import { Apierror } from "../utils/Apierror";
const {channelid} = req.params
import { asynchandler } from "../utils/Asynchander";
import { Apierror } from "../utils/Apierror";
import { Apiresponce } from "../utils/Apiresponce";
import User from "../models/user.model";


const getChannelStats = asynchandler(async (req, res) => {
   if(!mongoose.isValidObjectId(channelid)){
    throw Apierror(200,"channle no found")
   }
   const channelSubsciber = await User.aggregate([
         {
            $match : {
                _id : new mongoose.Types.ObjectId(channelid)
            }
         },
         {
            $lookup : {
                from : "subscribions",
                localField : "_id",
                foreignField: "channel",
                as : "subscribers"
            }
         },{
            $project : {
                subscribers : 1,
                _id: 0
            }
            
         },{
            $unwind : "$subscibers"
         },{
            $count : "subscribers"
         }
   ])

   if (!countSubscriber) {
    throw new Apierror(500 , "Something went wrong while count the subscribers")
}

const totalViews = await Video.aggregate(
    [
        {
          $match: {
            owner : new mongoose.Types.ObjectId(channelid)
          }
        },
        {
          $project: {
            views : 1,
            _id : 0,
          }
        },
        
      ]
)

if (!totalViews) {
    throw new Apierror(500 , "Something went wrong while count the views")
}

  let totalNumberOfViews = 0
  totalViews.forEach((viewObj) => totalNumberOfViews = totalNumberOfViews + viewObj.views )

  const countVideo = await Video.aggregate([
    {
        $match : {
            owner : new mongoose.Types.ObjectId(channelid)
        }
    },
    {
        $count : "count"
    }
  ])

  if (!countVideo) {
    throw new Apierror(500 , "Something went wrong while count the videos")
}

let totalVideos = countVideo[0].count
let totalSubscribers = countSubscriber[0].subscribers

return res
.status(200)
.json(
    new Apiresponce(
        200,
        {
            totalNumberOfSubscribers : totalSubscribers,
            totalNumberOfViews,
            totalNumberOfVideos : totalVideos
        },
        "data fetched"
    )
)
    
})

const getChannelVideos = asynchandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
})

export {
    getChannelStats, 
    getChannelVideos
    }