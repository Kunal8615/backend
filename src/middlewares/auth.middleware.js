import User from '../models/user.model.js';
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchander.js";
import jwt from "jsonwebtoken";

const verifyJWT = asynchandler(async (req, _, next) => {
    let token;
    let decodedToken;

    try {
      
        token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new Apierror(401, "Unauthorized request");
        }

       
        if (typeof token !== 'string' || !token.trim()) {
            throw new Apierror(401, "Invalid token format");
        }

       
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

     

       
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new Apierror(401, "Invalid Access Token");
        }

     
        req.user = user;
        next();
    } catch (error) {
        
        console.error("Error in verifyJWT middleware:", error);
        throw new Apierror(401, error?.message || "Invalid access token");
    }
});

export default verifyJWT;
