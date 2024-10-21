import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import { isValidObjectId } from "mongoose";
import {User} from "../models/user.model.js"


const createTweet = asyncHandler(async (req,res) => {
     
    const {content} = req.body
    if(!content){
        throw new ApiError(401,"Content field required")
    }

    const tweet = await Tweet.create({
        content,
        owner : req.user?._id
    })

    return res.status(200)
              .json(new ApiResponse(200,{tweet},"Tweet created"))
}) 


const getUserTweets = asyncHandler(async (req, res) => {
    const {userId} = req.params
    
    if(!userId){
        throw new ApiError(400,"Id not found")
    }
    
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Id not valid")
    }


    const tweets = await Tweet.find({
        owner : userId
    }).select("-owner")

    if(!tweets?.length){
        throw new ApiError(404,"User doesnot exist")
    }

    return res.status(200)
              .json(new ApiResponse(200,{tweets},"Fetched tweets successfully"))

})


const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    try {
        if(!tweetId){
            throw new ApiError(400,"videoId not found")
        }
    
        if(!isValidObjectId(tweetId)){
            throw new ApiError(401,"Invalid videoId")
        }
    
        const userTweet = await Tweet.findById(tweetId)
        if(!userTweet){
            throw new ApiError(404,"Invalid Id")
        }
    
        if(userTweet.owner.toString() !== req.user?._id.toString()){
            throw new ApiError(403,"Only owner can update tweets")
        }
    
        const {content} = req.body
        if(!content){
            throw new ApiError(401,"Tweet field cannot be empty")
        }
        
        const tweet = await Tweet.findByIdAndUpdate(tweetId,{
            $set : {
                content
            }
        },
        {new : true})
    
        return res.status(200)
                  . json(new ApiResponse(200,{tweet},"Tweet updated successfully"))
    
    } catch (error) {
        throw new ApiError(400,`${error?.message || "error while updating"}`)
    }
})








export {createTweet,getUserTweets,updateTweet}