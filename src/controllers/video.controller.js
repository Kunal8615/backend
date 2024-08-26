import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import  User  from "../models/user.model.js"
import { Apierror } from "../utils/Apierror.js"
import { Apiresponce } from "../utils/Apiresponce.js"
import { asynchandler } from "../utils/Asynchander.js"
import {uploadonCloundinary} from "../utils/cloudinary.js"


const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    if (!userId || !isValidObjectId(userId)) {
        throw new Apierror(400, "usernot found")
    }
    const videos = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                forignFeild: "owner",
                as: "Videos"
            }
        },
        {
            $unwind: "Videos"
        },
        {
            $project: {
                Videos: 1,
                _id: 0
            }
        }
    ])
    if (videos.length === 0) {
        return res
            .status(200)
            .json(
                Apiresponce(200, {}, "np videos there")
            )
    }
    let filteredVideos = videos.map(v => v.videos); // Extract the videos array
    if (query) {
        filteredVideos = filteredVideos.filter(video => video.title.toLowerCase().includes(query) || video.title.includes(query));
    }
    //
    if (sortBy && sortType) {
        filteredVideos.sort((a, b) => {
            if (sortType === 'asc') {
                return a[sortBy] > b[sortBy] ? 1 : -1;
            } else {
                return a[sortBy] < b[sortBy] ? 1 : -1;
            }
        });
    }

    const paginate = (page, limit, videos) => {
        const startingIndex = (page - 1) * limit
        const endIndex = page * limit
        return filteredVideos.slice(startingIndex, endIndex)
    }

    return res
        .status(200)
        .json(
            new Apiresponce(
                200,
                paginate(page, limit, videos),
                "Video fetched successfully"
            )
        )

})

const publishAVideo = asynchandler(async (req, res) => {
    const { title, description } = req.body
    if (!title && !description) {
        throw new Apierror(402, " title and description required ")
    }
    const videoLocalPath = req.files?.videofile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (!videoLocalPath) {
        throw new Apierror(400, "video must be required")
    }

    if (!thumbnailLocalPath) {
        throw new Apierror(400, "thumbnail must be required")
    }

    ///upload on cloudnairy

    const videoUpload = await uploadonCloundinary(videoLocalPath) //return url
    const thumbnail = await uploadonCloundinary(thumbnailLocalPath)


    if (!videoUpload) {
        throw new Apierror(500, "something went wrong while uploading the video on cloudinary")
    }

    if (!thumbnail) {
        throw new Apierror(500, "something went wrong while uploading thumbnail on cloudinary")
    }

    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new Apierror(400, " user not found")
    }

    const video = await Video.create({
        videofile: videoUpload.url,
        thumbnail: thumbnail.url,
        title: title,
        description: description,
        duration: videoUpload.duration,
        views: 0,
        ispublished: true,
        owner: req.user?._id
    });
    if (!video) {
        throw new Apierror(500, "try again later")
    }
    const videoData = await Video.findById(video._id)
    if (!videoData) {
        throw new Apierror(410, "video data not found")
    }


    return res.status(200).
        json(new Apiresponce(200, videoData, "video is publish"))
})

const getVideoById = asynchandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId || !isValidObjectId(videoId)) { 
        throw new Apierror(401,"videoid is invalid"); 
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new Apierror(401,"video not found"); 
    }

    if (video) {
        video.views = video.views + 1;
        await video.save({ validateBeforeSave: true });
    }

    return res.status(200).json(new Apiresponce(200, video, "video fetched successfully"));
});


const updateVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
   if(!mongoose.isValidObjectId(videoId) && !videoId){
    throw new Apierror(401,"invalid video id");
   }

   const video = await Video.findById(videoId)
   if(!video){
    throw new Apierror(401, "video not found")
   }
   if(video?.owner.toString()!==req.user?._id.toString()){
    throw new Apiresponce(401,"only owner can change")
   }

   const thumbnailLocalPath = req.files?.path
   if (!thumbnailLocalPath) {
       throw new Apierror(401,"Thumbnail not found")
   }

   const uploadThumbnail = await uploadonCloundinary(thumbnailLocalPath)

   const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
        $set: {
            title,
            description,
            thumbnail : uploadThumbnail.url
        }
    },
    {
        new: true
    }
   )

   if(!videoUpload){
    throw new Apierror(401 , "video not found")
   }
   return res
   .status(200)
   .json(
       new Apiresponce(
           200,
           updatedVideo,
           "video data updated sucessfully"
       )
   )
})

const deleteVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId && !isValidObjectId(videoId)){
        throw new Apierror(400,"incalid video id in parmas")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new Apierror(400,"video not found")
    }

    if(video?.owner.toString()!==req.user?._id.toString()){
        throw new Apierror(401,"only owner can delete the video")
    }

    const  deleteVideo = await Video.findByIdAndDelete(videoId)

    if(!deleteVideo){
        throw new Apierror(401," try again later")
    }

    return res.status(200).
    json( new Apiresponce(200,
        {},
        "successfully delete the video"
    ))
})
const togglePublishStatus = asynchandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new Apierror(400, "Invalid video Id");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new Apierror(401, "Video not found");
    }

    video.isPublished = !video.isPublished;
    await video.save({ validateBeforeSave: false });

    return res.status(200).json(
        new Apiresponce(200, video, "Toggle publish successful")
    );
});
export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}