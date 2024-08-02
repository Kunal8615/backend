import { User } from "../models/user.model"
import { Apierror } from "../utils/Apierror"
import { asynchandler } from "../utils/Asynchander"
import jwt from "jsonwebtoken"

export const verifyJWT = asynchandler(async(req,res,next)=>{
  try {
     const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
  
     if(!token){
      throw new Apierror(401,"unauthorized request")
     }
  
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
  
    if(!user){
      throw new Apierror(401,"invalid access Token")
    }
  
    req.user = user;
    next()
  } catch (error) {
    throw new Apierror(404,"error?.message " || "invalid access token")
  }
   
})