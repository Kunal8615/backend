import {asynchandler} from "../utils/Asynchander.js";
import {Apierror} from "../utils/Apierror.js"
import {User} from "../models/user.model.js"
//import {Jwt} from "jsonwebtoken"
import {uploadonCloundinary} from "../utils/cloudinary.js"
import { Apiresponce } from "../utils/Apiresponce.js";


const Registeruser = asynchandler(async(req,res) =>{
//   res.status(500).json({
//      message : "ok working"
// })

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

 const {fullname ,email,username,password } = req.body
 console.log("email :" , email);
//check validation all
if([fullname,email,username,password].some((feild)=>feild?.trim==="")){
    throw new Apierror(400,"all feild required")
}

//user check
 const existuser = User.findOne({
    $or:[{username},{email}]
})
if(existuser){
    throw new Apierror(409," already exist")
}
//by multer
 const avatarlocalpath = req.files?.avatar[0]?.path;
 const coverimagelocalpath = req.files?.coverimage[0]?.path;
 if(!avatarlocalpath){
    throw new Apierror(400,"avatar req")

 }
 //cloudnary upload

   const avatar = await uploadonCloundinary(avatarlocalpath)
   const coverimage = await uploadonCloundinary(coverimagelocalpath)
   if(!avatar){
    throw new Apierror(400,"avtar need!")
   }
    const user = await User.create({
    fullname,
    avatar : avatar.url,
    coverimage : coverimage?.url || "",
    email,
    password,
    username : username.toLowercase()
   })

//to remove
   const createduser = await user.findById(user._id).select(
    "-password -refreshToken"
   )
   if(!createduser){
    throw new Apierror (500,"wrong while register user")
   }

   //responce
   return res.status(201).json(
    new Apiresponce(200,createduser,"user registered succesfully")
   )
 
})

export default Registeruser;
