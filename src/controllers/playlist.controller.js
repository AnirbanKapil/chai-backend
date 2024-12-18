import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    
    if(!(name && description)){
        throw new ApiError(400,"Name & description fields cannot be empty")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner : req.user?._id
    })

    if(!playlist){
        throw new ApiError(400,"Error while creating playlist")
    }

    return res.status(200)
              .json(new ApiResponse(200,{playlist},"Playlist successfully created"))
    
})


const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if(!userId){
        throw new ApiError(400,"userId not found")
    }

    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid userId")
    }

    const userPlaylist = await Playlist.find({
        owner : userId
    })

    if(!userPlaylist){
        throw new ApiError(400,"userId not valid")
    }

    return res.status(200)
              .json(new ApiResponse(200,{userPlaylist},"Playlist successfully fetched"))

})


const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId){
        throw new ApiError(400,"PlaylistId not found")
    }

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlistId")
    }

    const playList = await Playlist.findById(playlistId)

    if(!playList){
        throw new ApiError(400,"Playlist not found")
    }

    return res.status(200)
              .json(new ApiResponse(200,{playList},"Playlist fetched successfully"))
})


const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    try {
        if(!(playlistId && videoId)){
            throw new ApiError(400,"playlistId and videoId required")
        }
    
        if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
            throw new ApiError(401,"Invalid playlistId & videoId")
        }
    
        const playList = await Playlist.findByIdAndUpdate(playlistId,{
            $addToSet : {
                videos : videoId
            }
        },{new : true})
    
        if(!playList){
            throw new ApiError(400,"Error while adding video in the playlist")
        }
    
        return res.status(200)
                  .json(new ApiResponse(200,{playList},"Video added successfully"))
    } catch (error) {
        throw new ApiError(400,error?.message || "error in adding video")
    }
})


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!(playlistId && videoId)){
        throw new ApiError(400,"playlistId and videoId required")
    }

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(401,"Invalid playlistId & videoId")
    }
    
    const playList = await Playlist.findById(playlistId)
    
    if(playList.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403,"Only owner can delete videos from playlist")
    }
    
    const removeVideo = await Playlist.findByIdAndUpdate(playlistId,
        {
            $pull : {
                videos : videoId
            }
        },
        {
            new : true
        })
    
    if(!removeVideo){
        throw new ApiError(400,"Error in removing video")
    }    
    

    return res.status(200)
              .json(new ApiResponse(200,{},"video removed"))
})


const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId){
        throw new ApiError(400,"PlaylistId not found")
    }

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Playlist invalid")
    }

    const userPlaylist = await Playlist.findById(playlistId)
    if(userPlaylist.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403,"Only owner can delete this playlist")
    }

    const playListDel = await Playlist.findByIdAndDelete(playlistId)
    
    if(!playListDel){
        throw new ApiError(400,"Error while deleting")
    }

    return res.status(200)
              .json(new ApiResponse(200,{},"Playlist deleted successfully"))
})


const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    
    if(!(name && description)){
        throw new ApiError(400,"Name and Description fields are required")
    }

    if(!playlistId){
        throw new ApiError(400,"PlaylistId not found")
    }
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"PlaylistId invalid")
    } 
    
    const userPlaylist = await Playlist.findById(playlistId)
    if(userPlaylist.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"Only owner can update this playlist")
    }
    
    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $set : {
                name,
                description
            }
        },
        {new : true})

    if(!updatedPlaylist){
        throw new ApiError(400,"Error while updating")
    }

    return res.status(200)
              .json(new ApiResponse(200,{updatedPlaylist},"Playlist updated successfully"))
})


export {createPlaylist,getUserPlaylists,getPlaylistById,addVideoToPlaylist,removeVideoFromPlaylist,deletePlaylist,updatePlaylist}