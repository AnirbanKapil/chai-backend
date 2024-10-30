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













export {toggleSubscription}