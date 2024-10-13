import mongoose from "mongoose"
import { asyncHandler } from "../utils/asyncHandler"
import { Comment } from "../models/comment.model"
import { ApiResponse } from "../utils/ApiResponse"
import { ApiError } from "../utils/ApiError"


const getVideoComments = asyncHandler(async (req,res) => {
      
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,"videoId required")
    }
    console.log(videoId)
})






export {getVideoComments}