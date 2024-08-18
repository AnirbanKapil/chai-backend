import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const registerUser = asyncHandler(async (req,res) => {
    const {username,email,fullname,password} = req.body
    
    if(
        [username,email,fullname,password].some((field)=>
        field?.trim() === "")
        ){
            throw new ApiError(400,"All the fields are required")
        } 


    const existedUser = User.findOne({
        $or : [{ username } , { email }]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already exist")
    }


    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(! avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    } 

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(! avatar){
        throw new ApiError(400,"Avatar file is required")
    }
    
})

export {registerUser};