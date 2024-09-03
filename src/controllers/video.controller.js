import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import  User  from "../models/user.model.js"
import { Apierror } from "../utils/Apierror.js"
import {Apiresponce} from "../utils/Apiresponce.js"
import { asynchandler } from "../utils/Asynchander.js"
import {uploadonCloundinary} from "../utils/cloudinary.js"


const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType , userId } = req.params
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
                foreignField: "owner",
                as: "videos"
            }
        },
        {
            $unwind: "$videos"
        },
        {
            $project: {
                videos: 1,
                _id: 0
            }
        }
    ])
    if (videos.length === 0) {
        return res
            .status(200)
            .json(
               new Apiresponce(200, {}, "np videos there")
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
        return videos.slice(startingIndex, endIndex)
    }

    return res
        .status(200)
        .json(
            new Apiresponce(
                200,
                paginate(page, limit, filteredVideos),
                "Video fetched successfully"
            )
        )

})

const publishAVideo = asynchandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title && !description) {
        throw new Apierror(402, "Title and description are required");
    }

    // Check if files are present
    const videoFiles = req.files?.videofile;
    const thumbnailFiles = req.files?.thumbnail;

    if (!videoFiles || !videoFiles[0]) {
        throw new Apierror(400, "Video file must be required");
    }

    if (!thumbnailFiles || !thumbnailFiles[0]) {
        throw new Apierror(400, "Thumbnail file must be required");
    }

    const videoLocalPath = videoFiles[0].path;
    const thumbnailLocalPath = thumbnailFiles[0].path;

    // Upload on Cloudinary
    const videoUpload = await uploadonCloundinary(videoLocalPath); // return URL
    const thumbnail = await uploadonCloundinary(thumbnailLocalPath);

    if (!videoUpload) {
        throw new Apierror(500, "Something went wrong while uploading the video on Cloudinary");
    }

    if (!thumbnail) {
        throw new Apierror(500, "Something went wrong while uploading thumbnail on Cloudinary");
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new Apierror(400, "User not found");
    }

    const video = await Video.create({
        videofile: videoUpload.url,
        thumbnail: thumbnail.url,
        title: title,
        description: description,
        duration: videoUpload.duration,
        views: 0,
        ispublished: true,
        owner: req.user?._id,
    });

    if (!video) {
        throw new Apierror(500, "Try again later");
    }

    const videoData = await Video.findById(video._id);
    if (!videoData) {
        throw new Apierror(410, "Video data not found");
    }

    return res.status(200).json(new Apiresponce(200, videoData, "Video is published"));
});


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
    const { videoId  } = req.params
    const { title, description ,thumbnail} = req.body;

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

   const thumbnailLocalPath = req.files?.thumbnail[0]?.path
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

   if(!updatedVideo){
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
    //console.log(req.params);
    var { videoid } = req.params;
 //   console.log(videoid);
    if (!videoid ) {
        throw new Apierror(400, "Invalid-video-Id");
    }
    if(!isValidObjectId(videoid)){
        throw new Apierror(401, "invalid object in DB")
    }
 
    const video = await Video.findById(videoid);

    if (!video) {
        throw new Apierror(401, "Video not found");
    }

    video.ispublished = !video.ispublished;
    await video.save({ validateBeforeSave: false });

    return res.status(200).json(
        new Apiresponce(200, video, "Toggle publish successful")
    );
});

const getAllUsersVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType } = req.params;

    //TODO: get all videos based on query, sort, pagination
    const users = await User.find({});

    if (!users) {
        throw new Apierror(400, "No users found");
    }

    const videos = await User.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos",
            },
        },
        {
            $unwind: "$videos",
        },
        {
            $project: {
                videos: 1,
                _id: 0,
            },
        },
    ]);

    if (videos.length === 0) {
        return res.status(200).json(new Apiresponce(200, {}, "No videos found"));
    }
    
    let filteredVideos = videos.map((v) => v.videos); // Extract the videos array
    
    if (query) {
        filteredVideos = filteredVideos.filter(
            (video) =>
                video.title.toLowerCase().includes(query.toLowerCase()) ||
            video.description.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    if (sortBy && sortType) {
        filteredVideos.sort((a, b) => {
            if (sortType === "asc") {
                return a[sortBy] > b[sortBy] ? 1 : -1;
            } else {
                return a[sortBy] < b[sortBy] ? 1 : -1;
            }
        });
    }
    
    const paginate = (page, limit, videos) => {
        const startingIndex = (page - 1) * limit;
        const endIndex = page * limit;
        return videos.slice(startingIndex, endIndex);
    };
  
    
    return res.status(200).json(
        new Apiresponce(
            200,
            paginate(page, limit, filteredVideos),
            "Videos fetched successfully"
        )
    );
});


const getUserByVideoId = asynchandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId || !mongoose.isValidObjectId(videoId)) {
        throw new Apierror(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new Apierror(404, "Video not found");
    }

    const user = await User.findById(video.owner);

    if (!user) {
        throw new Apierror(404, "User not found for this video");
    }

    return res.status(200).json(new Apiresponce(200, user, "User fetched successfully"));
});


export {
    getAllVideos,
    getAllUsersVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getUserByVideoId
}