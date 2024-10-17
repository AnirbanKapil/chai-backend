import mongoose from "mongoose";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { Video } from "../models/video.model.js";
import { isValidObjectId } from "mongoose";


const publishAVideo = asyncHandler(async(req,res) => {
    const {title,description} = req.body
    
    try {
        if(
            [title,description].some((field) => field.trim() === "")
          )
            {
                throw new ApiError(400,"title & description fields required")
            }
        
        
        const videoLocalPath = req.files?.videoFile[0]?.path
        const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    
        if(!videoLocalPath){
            throw new ApiError(400,"video file not found")
            }   
        if(!thumbnailLocalPath){
            throw new ApiError(400,"video file not found")
            }      
        
        const uploadedVideo = await uploadOnCloudinary(videoLocalPath)
        const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    
        if(!uploadedVideo){
            throw new ApiError(500,"error while uploading on cloudinary")
        }
        if(!uploadedThumbnail){
            throw new ApiError(500,"error while uploading on cloudinary")
        }
    
        const videoInfo = await Video.create({
             title : title,
             description : description,
             videoFile : uploadedVideo.url,
             thumbnail : uploadedThumbnail.url,
             duration : uploadedVideo.duration,
             owner : req.user?._id
        })
    
        if(!videoInfo){
            throw new ApiError(500,"error while uploading")
        }
    
        return res.status(200)
                  .json(new ApiResponse(200,{videoInfo},"upload successfull"))
    } catch (error) {
        console.log(`error msg : ${error.message} ||`)
    }
})


const getVideoById = asyncHandler(async (req,res) => {
    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(400,"VideoId required")
    }
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video Id");
      }

    const video = await Video.findById(videoId)
    
    if(!video){
        throw new ApiError(401,"video id invalid")
    }

    return res.status(200)
              .json(new ApiResponse(200,{video},"video fetched successfully")) 
})


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    try {
        if(!videoId){
            throw new ApiError(400,"VideoId required")
        }
        if (!isValidObjectId(videoId)) {
            throw new ApiError(400, "Invalid Video Id");
          }
        
        
          
        const thumbnailLocalPath = req.file?.path
        if(!thumbnailLocalPath){
            throw new ApiError(400, "thumbnail files required")
        }
    
        
        const newThumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        
        await Video.findByIdAndUpdate(videoId,{
            $set : {
                thumbnail : newThumbnail.url,
            }
        },
        {
            new : true
        })
        
        return res.status(200)
                  .json(new ApiResponse(200,{},"Thumbnail updated")) 
    
    } catch (error) {
        throw new ApiError(500,error?.message || "error while updating")    
    }
})


export {publishAVideo,getVideoById,updateVideo}