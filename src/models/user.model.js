import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Schema } = mongoose;

const userschema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    avatar: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    coverimage: {
        type: String
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

// Pre hooks for middleware
userschema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (error) {
        return next(error);
    }
});

// Methods
userschema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userschema.methods.generateAccessToken = async function() {
    const payload = {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    return token;
};
userschema.methods.generateRefreshToken = async function() {
    const payload = {
        _id: this._id
    };
    const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10d' });
    return token;
};

// Exporting model
const User = mongoose.model("User", userschema);
export default User; // Ensure this is a default export
