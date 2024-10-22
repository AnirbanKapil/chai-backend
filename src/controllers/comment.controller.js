import mongoose, { isValidObjectId } from "mongoose"
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


const addComment = asyncHandler(async (req, res) => {
    
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(401,"VideoId not found")
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid videoId")
    }

    const {content} = req.body;

    if(!content){
        throw new ApiError(400,"Content field is empty")
    }

    const comment = await Comment.create({
        content,
        video : videoId,
        owner : req.user?._id
    })

    if(!comment){
        throw new ApiError(400,"Error while posting")
    }

    return res.status(200)
              .json(new ApiResponse(200,{comment},"Comment posted successfully"))   
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if(!commentId){
        throw new ApiError(400,"CommentId not found")
    }
    
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid commentId")
    }
    
    const commentOwner = await Comment.findById(commentId)
    if(commentOwner.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403,"Only owner can update the comment")
    }
    
    const {content} = req.body
    if(!content){
        throw new ApiError(400,"Content field is empty")
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId,{
        $set : {
            content 
        }
    },
    {new : true})

    if(!updateComment){
        throw new ApiError(400,"Error while updating")
    }

    return res.status(200)
              .json(new ApiResponse(200,{updatedComment},"Comment updated successfully"))
})



export {getVideoComments,addComment,updateComment}