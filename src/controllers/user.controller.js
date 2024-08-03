import { asynchandler } from "../utils/Asynchander.js";
import { Apierror } from "../utils/Apierror.js"
import { User } from "../models/user.model.js"
//import {Jwt} from "jsonwebtoken"
import { uploadonCloundinary } from "../utils/cloudinary.js"
import { Apiresponce } from "../utils/Apiresponce.js";


const GenerateAccessAndRefreshTokens = async (userId) => {
   try {
      const user = await User.findById(userId)
      const accesdToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      //data base me save

      user.refreshToken = refreshToken
      await user.save({ validteBeforeSave: false })

      return { accesdToken, refreshToken }


   } catch (error) {
      throw new Apierror(500, "something went wrong while generate tokens")
   }
}

const Registeruser = asynchandler(async (req, res) => {
   res.status(500).json({
      message: "ok working"
   })

   //Register user

   //1. get user detail from frontend example postman
   //2.validation- not empty
   // 3.check if user already exixt by username - email
   //check for images,check for avatar
   //upload them to cloudnary ,check avatar
   //create user object - create entry in db
   //remove password and refresh token feild from  response
   //check for user creation
   //return responce otherwise  throew error

   const { fullname, email, username, password } = req.body
   console.log("email :", email);
   //check validation all

   if ([fullname, email, username, password].some((feild) => feild?.trim === "")) {
      throw new Apierror(400, "all field are required")
   }

   //user check
   const existuser = await User.findOne({
      $or: [{ username }, { email }]
   })
   if (existuser) {
      throw new Apierror(409, " user  already exist")
   }
   //by multer
   //let coverimagelocalpath;
   //if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
      //   coverimagelocalpath = req.files.coverimage[0].path
      //  }
      
   const coverimagelocalpath = req.files?.coverimage[0]?.path;
   const avatarlocalpath = req.files?.avatar[0]?.path;

   if (!avatarlocalpath) {
      throw new Apierror(400, "avatar req")
   }

   //cloudnary upload

   const avatar = await uploadonCloundinary(avatarlocalpath)
   const coverimage = await uploadonCloundinary(coverimagelocalpath)
   if (!avatar) {
      throw new Apierror(400, "avtar need!")
   }

   //create user

   const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverimage: coverimage?.url || "",
      email,
      password,
      username: username.toLowerCase()
   })

   //check created user and remove password and refresh token

   const createduser = await User.findById(user._id).select(
      "-password -refreshToken")

   if (!createduser) {
      throw new Apierror(500, "wrong while register user")
   }
   console.log(req.files);

   //responce

   return res.status(201).json(
      new Apiresponce(200, createduser, 
         "user registered succesfully") )

})

//Login user

const loginUser = asynchandler(async (req, res) => {
   //step
   //req-body -> data
   //username or email 
   //find the user
   //password check
   //access and refresh toekn generate
   //send cookies of tokens


   const { email, username, password } = req.body;
   if (!username || !email) {
      throw new Apierror(400, "username or password is required")
   }

   const user = await User.findOne({
      $or: [{ username }, { email }]
   })

   if (!user) {
      throw new Apierror(404, "<< user does not exist >>")
   }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
      throw new Apierror(401, "invalid-user-credentials")
   }

   const { accesdToken, refreshToken } = await GenerateAccessAndRefreshTokens(user._id)

   const loggedinUser = await User.findById(user._id).select("-password -refreshToken")

   ///send to cookiee
   const options = {
      httpOnly: true,
      secure: true
   }

   return res
      .status(200)
      .cookie("accessToken", accesdToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new Apiresponce(
            200, {
            user: loggedinUser, accesdToken, refreshToken
         },
            "user logged in succesfully"
         )
      )

})

const logoutUser = asynchandler(async (req, res) => {

   User.findByIdAndUpdate(
      req.user._id,
      {
         $set: {
            refreshToken: undefined
         }
      },
      {
         new: true
      }

   )
   const options = {
      httpOnly: true,
      secure: true
   }

   return res.status(200)
      .clearCookie("accessToken", options)
      .json(new Apiresponce(200, {}, "<<user logged out >>"))
})


export { Registeruser, loginUser, logoutUser };
