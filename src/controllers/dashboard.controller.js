import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Like} from "../models/like.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Video} from "../models/video.model.js"


const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const getChannelStats = {}

    const videoStats = await Video.aggregate(
        [
            {
              '$match': {
                'owner': req.user?._id
              }
            }, 
            {
              '$group': {
                '_id': null, 
                'totalViews': {
                  '$sum': '$views'
                }, 
                'totalVideos': {
                  '$count': {}
                }
              }
            }
          ]
    )


    const subscriberStats = await Subscription.aggregate(
        [
            {
              $match : {
                channel : req.user?._id
              }  
            },
            {
                $count : "TotalSubscribers"
            }
        ]
    ) 
    

    const likeStats = await Like.aggregate(
      [
        {
          $match : {
            video : {$exists : true}
          }
        },
        {
          $group : {
            _id : req.user?._id
          }
        },
        {
          $count : "TotalLikes"
        }
      ]
    )

    getChannelStats.totalViews = (videoStats && videoStats[0]?.totalViews) || 0
    getChannelStats.totalVideos = (videoStats && videoStats[0]?.totalVideos) || 0
    getChannelStats.totalSubs = (subscriberStats && subscriberStats[0]?.TotalSubscribers) || 0
    getChannelStats.totalVideoLikes = (likeStats && likeStats[0]?.TotalLikes) || 0
    return res.status(200)
              .json(new ApiResponse(200,getChannelStats,"Channel stats fetched successfully"))
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