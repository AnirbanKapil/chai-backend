import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        user.save({validateBeforeSave : false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh token")
    }
}


const registerUser = asyncHandler(async (req,res) => {
    const {username,email,fullname,password} = req.body
    
    if(
        [username,email,fullname,password].some((field)=>
        field?.trim() === "")
        ){
            throw new ApiError(400,"All the fields are required")
        } 


    const existedUser = await User.findOne({
        $or : [{ username } , { email }]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already exist")
    }


    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(! avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    } 

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(! avatar){
        throw new ApiError(400,"Avatar file is required")
    }


    const user = await User.create({
        fullname,
        avatar : avatar?.url,
        coverImage : coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering")
    }


    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")  
    )
    
})


const loginUser = asyncHandler(async (req,res)=>{
    const {email,username,password} = req.body;
     
    if(!(username || password)){
        throw new ApiError(400,"username or password required")
    }

    const user =await User.findOne({
        $or : [{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid password")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
          httpOnly : true,
          secure : true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
       new ApiResponse(
        200,{
            user : loggedInUser,accessToken,refreshToken
        },
        "User logged in successfully"
       ) 
    )

})


const logoutUser = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },    
        {
            new : true
        }
        
    ) 
    
    const options = {
        httpOnly : true,
        secure : true
  }
    
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged Out"))
})


const refreshAccessToken = asyncHandler(async (req,res)=>{
    
        const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
        
        if(! incommingRefreshToken){
            throw new ApiError(401,"Unauthorized request")
        }
        
    try{

        const decodedToken = jwt.verify(incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(incommingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token expired or used")
        }
       
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
        const options ={
            httpOnly : true,
            secure : true
        }
        
        return res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken , refreshToken:newRefreshToken},
                "Access token refreshed"
            )
        ) 
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid refresh token")
    }
    
})


const changeCurrentPassword = asyncHandler(async (req, res) => {
      const {oldPassword,newPassword} = req.body

      const user = await User.findById(req.user?.id)

      const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

      if(! isPasswordCorrect){
        throw new ApiError(400,"Invalid old password")
      }

      user.password = newPassword

      await user.save({validateBeforeSave : false})

      return res.status(200)
      .json( new ApiResponse (200,{},"Password changed successfully"))

})


export {registerUser,
        loginUser, 
        logoutUser,
        refreshAccessToken,
        changeCurrentPassword  
};