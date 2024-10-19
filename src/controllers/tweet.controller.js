import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";


const createTweet = asyncHandler(async (req,res) => {
     
    const {content} = req.body
    if(!content){
        throw new ApiError(401,"Content field required")
    }

    const tweet = await Tweet.create({
        content
    })

    return res.status(200)
              .json(new ApiResponse(200,{tweet},"Tweet created"))
}) 










export {createTweet}