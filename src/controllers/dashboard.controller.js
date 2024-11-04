import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Like} from "../models/like.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Video} from "../models/video.model.js"


const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
   
})



const getChannelVideos = asyncHandler(async (req, res) => {
    const owner = req.user?._id

    const ownerVideos = await Video.aggregate(
        [
            {
              '$match': {
                'owner': new mongoose.Types.ObjectId(owner)
              }
            }, {
              '$group': {
                '_id': '$owner', 
                'videos': {
                  '$addToSet': '$videoFile'
                }
              }
            }, {
              '$project': {
                _id : 0,
                'owner': '$_id', 
                'videos': 1, 
                'NoOfVideos': {
                  '$size': '$videos'
                }
              }
            }
          ]
    )
    if(!ownerVideos){
        throw new ApiError(400,"Unable to find videos")
    }

    return res.status(200)
              .json(new ApiResponse(200,ownerVideos,"Videos fetched successfully"))
})

export {getChannelStats,getChannelVideos}