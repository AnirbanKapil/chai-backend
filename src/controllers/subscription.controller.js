import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"



const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    if(!channelId){
        throw new ApiError(400,"ChannelId not found")
    }
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channelId")
    }

    const subscription = await Subscription.findOne({
        channel : channelId,
        subscriber : req.user?._id
    })

    if(subscription){
        await Subscription.findByIdAndDelete(subscription._id)
        return res.status(200)
              .json(new ApiResponse(200,{},"Channel unsubcribed")) 
    }else{
        await Subscription.create({
            subscriber : req.user?._id,
            channel : channelId
        })
        return res.status(200)
        .json(new ApiResponse(200,{},"Channel subscribed")) 
    }
})


const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400,"ChannelId not found")
    }
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channelId")
    }

   try {
     const subs = await Subscription.aggregate(
        [
            {
              '$match': {
                'channel': new mongoose.Types.ObjectId(channelId)
              }
            }, {
              '$group': {
                '_id': '$channel', 
                'subscribers': {
                  '$addToSet': '$subscriber'
                }
              }
            }, {
              '$project': {
                'channel': 1, 
                'subscribers': 1, 
                'subscriberCount': {
                  '$size': '$subscribers'
                }
              }
            }
          ]
     )
 
     if(!subs?.length){
         throw new ApiError(404,"User doesnot exist")
     }
 
     return res.status(200)
               .json(new ApiResponse(200,subs,"User's subscribers fetched successfully"))
   } catch (error) {
     throw new ApiError(400,error?.message || "error while getting subs")
   }
})


const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    
    if(!subscriberId){
        throw new ApiError(400,"subscriber's id not found")
    }
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400,"Invalid id")
    }

    const subscribedTo = await Subscription.aggregate(
       [
        {
            $match : {
                subscriber : new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $group : {
                _id : "$subscriber",
                "ChannelsSubscribedTo" : {$addToSet : "$channel"} 
            }
        },
        {
            $project : {
                "ChannelsSubscribedTo" : 1,
                noOfChannelSubscribedTo : {
                  $size : "$ChannelsSubscribedTo"
                }
            }
        }
       ] 
    )

    if(!subscribedTo){
        throw new ApiError(400,"error while fetching")
    }
    return res.status(200)
              .json(new ApiResponse(200,subscribedTo,"Channels subscribed to fetched successfully"))
})







export {toggleSubscription , getUserChannelSubscribers,getSubscribedChannels}