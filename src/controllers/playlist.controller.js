import mongoose, {isValidObjectId} from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { asynchandler } from "../utils/Asynchander";
import { Apierror } from "../utils/Apierror";
import { Apiresponce } from "../utils/Apiresponce";
import User from "../models/user.model";

const createPlaylist = asynchandler(async (req, res) => {
    const {name, description} = req.body

    const user = await User.findById(req.user?._id);
    if(!user){
        throw Apierror(401,"user not found")
    }
    if(!name &&!description){
        throw Apierror(401,"content is missing")
    }

    const playlist = await Playlist.create({
        name ,
        description,
        owner : user._id
    })

    return res.status(200).json(new Apiresponce(200, playlist, "playlist successfully"));
    
   
})

const getUserPlaylists = asynchandler(async (req, res) => {
    const {userId} = req.params
    if (!userId || !isValidObjectId(userId)) {
        throw new Apierror(400 , "Invalid Object Id")
    }
    const user = await User.findById(userId).select("-password -refreshToken");
    console.log("user : " ,user)

    if (!user) {
        throw new Apierror(400 , "user not found")
    }
    const playlists = await Playlist.find({owner : userId})
    console.log(playlists);

    if (!playlists) {
        throw new Apierror(400 , "playlist not found")
    }

    
    return res
    .status(200)
    .json(
        new Apiresponce(
            200,
            playlists,
            "playlists fetched sucessfully"
        )
    )

   
})

const getPlaylistById = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
})

const addVideoToPlaylist = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params
})

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}