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

    const subs = await Subscription.aggregate([
        {
            $match :{
                channel : new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "channel",
                foreignField : "_id",
                as : "subscribers"
            }
        },
        {
            $addFields : {
                subscribersCount : {
                    $size : "$subscribers"
                }
            }
        },
        {
            $project : {
                subscribers : {
                    username : 1,
                    fullname : 1,
                    _id : 1
                },
                subscribersCount : 1,
            }
        }
    ])

    if(!subs?.length){
        throw new ApiError(404,"User doesnot exist")
    }

    return res.status(200)
              .json(new ApiResponse(200,subs,"User's subscribers fetched successfully"))
})










export {toggleSubscription , getUserChannelSubscribers}