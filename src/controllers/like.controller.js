import mongoose, { isValidObjectId } from "mongoose";
import {Like} from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
   try {
     if(!videoId){
         throw new ApiError(400,"VideoId not found")
     }
     
     if(!isValidObjectId(videoId)){
         throw new ApiError(400,"Invalid videoId")
     }

    const alreadyLiked = await Like.findOne(
        {video : videoId , likedBy : req.user?._id}
    )
     
     if(alreadyLiked){
         await Like.findByIdAndDelete(alreadyLiked?._id)
     }else{
         await Like.create({
             video : videoId,
             likedBy : req.user?._id
         })
     }
 
     return res.status(200)
               .json(new ApiResponse(200,{alreadyLiked : !!alreadyLiked},"toggle successful"))
   } catch (error) {
       throw new ApiError(400,error?.message || "error in toggle") 
   }
    
})


const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if(!commentId){
        throw new ApiError(400,"CommentId not found")
    }

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"CommentId invalid")
    }

    const likedComment = await Like.findOne(
        {comment : commentId , likedBy : req.user?._id}
    )
    
    if(likedComment){
        await Like.findByIdAndDelete(likedComment?._id)
    }else{
        await Like.create({
          comment : commentId,
          likedBy : req.user?._id
        })
    }
    return res.status(200)
              .json(new ApiResponse(200,{likedComment : !!likedComment},"toggle successful"))
})


