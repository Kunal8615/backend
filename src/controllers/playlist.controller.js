import mongoose, {isValidObjectId} from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { asynchandler } from "../utils/Asynchander.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponce } from "../utils/Apiresponce.js";
import User from "../models/user.model.js";

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
    if(!playlistId && !isValidObjectId(playlistId)){
        throw new Apierror(401,"invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new Apierror(440,"playlist not found")
    }

    return res.status(200)
    .json(new Apiresponce(200,playlist," playist fetched"))
})

const addVideoToPlaylist = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!playlistId && !videoId){
        throw new Apierror(401," wrong id's")
    }
    if(!isValidObjectId(playlistId) && !isValidObjectId(videoId)){
        throw new Apierror(401, " not a valid object in db")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlistId){
        throw new Apierror(400," playlist not found")
    }


    for(let i = 0 ; i < playlist.videos.length ; i++ ){
        if(playlist.videos[i] == videoId){
            throw new Apierror(401 , "video is already available in playlist")
        }
    }

    await playlist.videos.push(videoId)
    await playlist.save({validateBeforeSave : true})

    return res
    .status(200)
    .json(
        new Apiresponce(
            200,
            playlist,
            "video added sucessfully"
        )
    )

})

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new Apierror(400, "playlist id not found");
    }

    if (!videoId || !isValidObjectId(videoId)) {
        throw new Apierror(400, "video id not found");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new Apierror(401, "playlist not found in database");
    }

    // Debugging line
    console.log("Playlist Videos:", playlist.videos);

    if (!Array.isArray(playlist.videos)) {
        throw new Apierror(400, "playlist videos should be an array");
    }

    const updatedPlaylist = playlist.videos.filter((item) => {
        return !item.equals(videoId);
    });

    playlist.videos = updatedPlaylist;
    await playlist.save({ validateBeforeSave: true });

    return res
        .status(200)
        .json(
            new Apiresponce(
                200,
                playlist,
                "video removed successfully"
            )
        );
});


const deletePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    if (!playlistId || !isValidObjectId(playlistId)) {
        throw new Apierror(400 , "Invalid playlist Id")
    }

    const deletePlaylist = await Playlist.deleteOne({_id : playlistId})

    if (deletePlaylist.deletedCount === 0) {
        throw new Apierror(401 , "Playlist not found")
    }

    return res
    .status(200)
    .json(
        new Apiresponce(
            200,
            {},
            "playlist deleted"
        )
    )
    
})

const updatePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!playlistId && !isValidObjectId(playlistId)){
        throw new Apierror(400,"not a valid playlist id")
    }


    const playlist = await Playlist.findOneAndUpdate(playlistId,
        {
            $set : {
                name,
                description
            }
        },
        {
            new : true
        }
    )

    if (!playlist) {
        throw new Apierror(401 , "playlist not found")
    }

    return res
    .status(200)
    .json(
        new Apiresponce(
            200, 
            playlist,
            "playlist update successfully"
        )
    )

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