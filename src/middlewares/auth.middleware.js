import User from '../models/user.model.js';
import { Apierror } from "../utils/Apierror.js"
import { asynchandler } from "../utils/Asynchander.js"
import jwt from "jsonwebtoken"

 
 const verifyJWT = asynchandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new Apierror(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new Apierror(401, "Invalid Access Token")
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new Apierror(401, "error?.message "|| "Invalid access token")
    }
    
})
export default verifyJWT;