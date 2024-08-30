import { asynchandler } from "../utils/Asynchander.js";
import { Apierror } from "../utils/Apierror.js";
import User from "../models/user.model.js";
import { uploadonCloundinary } from "../utils/cloudinary.js";
import { Apiresponce } from "../utils/Apiresponce.js";
import jwt, { decode } from "jsonwebtoken"
import mongoose, { mongo } from "mongoose";

const GenerateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        // Save refresh token in database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Apierror(500, "something went wrong while generating tokens");
    }
};

const Registeruser = asynchandler(async (req, res) => {
    // Debugging Statements
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    const { fullname, email, username, password } = req.body;

    // Check validation
    if ([fullname, email, username, password].some(field => !field || field.trim() === "")) {
        throw new Apierror(400, "All fields are required");
    }

    // Check if user already exists
    const existuser = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (existuser) {
        throw new Apierror(409, "User already exists");
    }

    // Check for avatar and cover image files
    const avatarlocalpath = req.files?.avatar?.[0]?.path;
    let coverimagelocalpath = req.files?.coverimage?.[0]?.path;

    if (!avatarlocalpath) {
        throw new Apierror(400, "Avatar is required");
    }

    // Upload to Cloudinary
    const avatar = await uploadonCloundinary(avatarlocalpath);
    const coverimage = coverimagelocalpath ? await uploadonCloundinary(coverimagelocalpath) : { url: "" };

    if (!avatar) {
        throw new Apierror(400, "Avatar upload failed");
    }

    // Create user
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverimage.url,
        email,
        password,
        username: username.toLowerCase()
    });

    // Check created user and remove password and refresh token
    const createduser = await User.findById(user._id).select("-password -refreshToken");

    if (!createduser) {
        throw new Apierror(500, "Error while registering user");
    }

    // Response
    return res.status(201).json(new Apiresponce(200, createduser, "User registered successfully"));
});


// Login user
const loginUser = asynchandler(async (req, res) => {
    const { email, username, password } = req.body;
    if (!username && !email) {
        throw new Apierror(400, "Username or email is required");
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (!user) {
        throw new Apierror(404, "User does not exist");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new Apierror(401, "Invalid user credentials");
    }
    const { accessToken, refreshToken } = await GenerateAccessAndRefreshTokens(user._id);
  //  console.log(accessToken,refreshToken);
    const   loggedinUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
       
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000)
    };
    console.log( loggedinUser,"login done");
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new Apiresponce(200, { user: loggedinUser, accessToken, refreshToken },
             "User logged in successfully"));
    });

const logoutUser = asynchandler(async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $unset: {
          refreshToken: 1
        }
      }, {
        new: true
      });
      const options = {
        httpOnly: true,
        secure: true
      };
 
  console.log("user logout done");
      return res.status(200)
        .clearCookie("accessToken", options).clearCookie("refreshToken", options)
        .json(new Apiresponce(200, {}, "User logged out"));
    } catch (error) {
      return res.status(500).json(new Apiresponce(500, {}, "An error occurred during logout"));
    }
  });
  

//refreshAccessToken

const refreshAccessToken = asynchandler(async (req, res) => {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new Apierror(401, "unautherized req")
    }

    try {
        const decodedeToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = User.findById(decodedeToken?._id)

        if (!user) {
            throw new Apierror(401, "invalid refresh token")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new Apierror(401, " Refresh Token is Expired or Used")
        }
        const options = {
            httpOnly: true,
            secure: true
        }


        const { accessToken, newrefreshToken } = await GenerateAccessAndRefreshTokens(user._id)
        return res
            .status(200)
            .cookie("accressToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new Apiresponce(
                    200,
                    { accessToken, refreshToken: newrefreshToken }, "access token is refreshed"
                )
            )
    } catch (error) {
        throw new Apierror(401, "prolum" || "invalid refresh token")
    }
})

const changeCurrentPassword = asynchandler(async(req,res)=>{
    const {oldpassword,newpassword} = req.body

 //   if(!(newpassword === confgPassword)){  }

     const user = await User.findById(req.user?._id)
      const isPasswordCorrect = await user.isPasswordCorrect(oldpassword)
      if(!isPasswordCorrect){
        throw new Apierror(400,"invalid password")
      }

      user.password = newpassword
       await user.save({validateBeforeSave:false})
       
       return res.status(200)
       .json(new Apiresponce(200,{},"passsword changed succefullly"))
})

const changeUserName = asynchandler(async (req, res) => {
    const { newusername, password } = req.body
    console.log("user fetched");
    // Check if newusername and password are provided
    if (!newusername || !password) {
        throw new Apierror(400, "New username and password are required");
    }

    // Find user by ID from the request
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new Apierror(404, "User not found");
    }
    console.log("user fetched");
    // Check if the provided password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new Apierror(400, "Invalid password");
    }
    console.log("password checked");
    // Update username and save user
    user.username = newusername;
    await user.save({ validateBeforeSave: false });
    console.log("username updated"); 
    // Send success response
    return res.status(200)
        .json(new Apiresponce(200, res.user, "Username changed successfully"));
});


const getCurrentUser = asynchandler(async(req,res)=>{
    return res.status(200)
    .json(new Apiresponce(200,req.user,"user current user"))
})

//
//update detail
const updateAccountDetail = asynchandler(async(req,res)=>{

    const {fullname,email} = req.body
    if(!fullname || !email){
        throw new Apierror(400,"all feild are req")
    }
   const user =  User.findByIdAndUpdate(req.user?._id,
        {
            $set :{
                fullname,
                email
            }
        },
        { new : true}
    ).select ("-password")

        return res.status(200)
        .json(new Apiresponce(200,user,"account detail updated successfully"))
})


//file update

const updateUserAvatar = asynchandler(async(req,res)=>{
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new Apierror(400, "avatar file missing")
    }

    const avatar = await uploadonCloundinary(avatarLocalPath)
    if(!avatar.url){
        throw new Apierror(400,"error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {

            $set : {
                avatar : avatar.url
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new Apiresponce(200, user , "avatar image upload successfully ")
    )
})


const updateUserCoverimage = asynchandler(async(req,res)=>{

    const coverLocalPath = req.file?.path

    if(!coverLocalPath){
        throw new Apierror(400, "cover file missing")
    }

    const coverimage = await uploadonCloundinary(coverLocalPath)
    if(!coverimage.url){
        throw new Apierror(400,"error while uploading on cover")
    }

   const user =   await User.findByIdAndUpdate(
        req.user?._id,
        {

            $set : {
                coverimage : coverimage.url
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new Apiresponce(200,user , "cover image upload successfully ")
    )
})

const getUserChannelProfile = asynchandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new Apierror(400, "User not found");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "Subscription",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscription",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscriberTo"
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                channelSubscribeToCount: {
                    $size: "$subscriberTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                subscriberCount: 1,
                isSubscribed: 1,
                channelSubscribeToCount: 1,
                avatar: 1,
                coverimage: 1,
                email: 1
            }
        }
    ]);

    if (!channel?.length) {
        throw new Apierror(400, "Channel not found");
    }

    return res
        .status(200)
        .json(new Apiresponce(200, channel, "Data channel fetched successfully"));
});


const getWatchHistory = asynchandler(async(req,res)=>{
    const user = await User.aggregate([
        {
            $match : {
                _id : new mongoose.Types.ObjectId(req.user._id)
            }
            
        },
        {
            $lookup : {
                from : "Videos",
                localField : "watchHistory",
                foreignField : "_id",
                as : "watchHistory",
                pipeline : [
                    {
                        $lookup : {
                            from : "users",
                            localField : "owner",
                            foreignField : "_id",
                            as : "owner",
                            pipeline : [
                                {
                                    $project : {
                                        fullname :1,
                                        username : 1,
                                        avatar : 1
                                    }
                                },{
                                    $addFields : {
                                        owner : {
                                            $first : "$owner"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new Apiresponce(200,user[0].watchHistory, "watched history fetched successfully")
    )
})

export { Registeruser, loginUser, logoutUser, refreshAccessToken ,changeCurrentPassword
    ,getCurrentUser,updateUserAvatar,updateUserCoverimage,changeUserName, updateAccountDetail,getWatchHistory ,getUserChannelProfile};
