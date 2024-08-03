import { asynchandler } from "../utils/Asynchander.js";
import { Apierror } from "../utils/Apierror.js";
import User from "../models/user.model.js";
import { uploadonCloundinary } from "../utils/cloudinary.js";
import { Apiresponce } from "../utils/Apiresponce.js";

const GenerateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

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

    const loggedinUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new Apiresponce(200, { user: loggedinUser, accessToken, refreshToken }, "User logged in successfully"));
});

const logoutUser = asynchandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: undefined }, { new: true });

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .clearCookie("accessToken", options)
        .json(new Apiresponce(200, {}, "User logged out"));
});

export { Registeruser, loginUser, logoutUser };
