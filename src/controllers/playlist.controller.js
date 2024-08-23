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
    //TODO: get user playlists
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