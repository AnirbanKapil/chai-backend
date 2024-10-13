import mongoose from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Comment } from "../models/comment.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"


const getVideoComments = asyncHandler(async (req,res) => {
      
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,"videoId required")
    }
    console.log(videoId)
})






export {getVideoComments}