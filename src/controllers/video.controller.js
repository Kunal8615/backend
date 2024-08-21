import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { Apierror } from "../utils/Apierror.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    if (!userId || isValidObjectId(userId)) {
        throw Apierror(400, "usernot found")
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
                ApiResponse(200, {}, "np videos there")
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

    const paginate = (page , limit , videos) => {
        const startingIndex = (page - 1) * limit
        const endIndex = page * limit
        return filteredVideos.slice(startingIndex , endIndex)
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            paginate(page , limit , videos),
            "Video fetched successfully"
        )
    )

})

const publishAVideo = asynchandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}