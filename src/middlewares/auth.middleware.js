import User from '../models/user.model.js';
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchander.js";
import jwt from "jsonwebtoken";

const verifyJWT = asynchandler(async (req, _, next) => {
    let token;
    let decodedToken;

    try {
        // Token ko cookies ya headers se extract karna
        console.log(req.cookies);
        console.log(req.body);
        token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // Token extraction ko check karne ke liye logging
        console.log("Extracted Token:", token);

        // Agar token nahi mila, toh error throw karo
        if (!token) {
            throw new Apierror(401, "Unauthorized request");
        }

        // Ensure karo ki token valid string hai
        if (typeof token !== 'string' || !token.trim()) {
            throw new Apierror(401, "Invalid token format");
        }

        // Token ko verify karna
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Decoded token ko logging karna
        console.log("Decoded Token:", decodedToken);

        // User ko database se fetch karna
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // Agar user nahi mila, toh error throw karo
        if (!user) {
            throw new Apierror(401, "Invalid Access Token");
        }

        // User ko request object mein add karna
        req.user = user;
        next();
    } catch (error) {
        // Error ko logging karna
        console.error("Error in verifyJWT middleware:", error);
        throw new Apierror(401, error?.message || "Invalid access token");
    }
});

export default verifyJWT;
