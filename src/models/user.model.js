
import mongoose, { Schema } from "mongoose"
import { Jwt } from "jsonwebtoken"
import bcrypt from "bcrypt"
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
        trim: true,

    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, //cloudinary
        required: true,

    },
    coverimage: {
        type: String,

    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "pass is required"]
    },

    refreshToken: {
        type: String
    }


}, { timestamps: true })
///Pre hooks
userschema.Schema.pre("Save", async function (next) {
    if(this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10)
    next()
})

userschema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password)
}
// Generate access token method
userSchema.methods.generateAccessToken = async function() {
    const payload = {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    };
     // sign method to generate the JWT token
     const token = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
     return token;
}
   
userschema.methods.generateRefreshToken = async function(){

    const payload = {
        _id: this._id,
      
    };
     // sign method to generate the JWT token
     const token = await jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10d' });
     return token;
}
export const User = mongoose.model("User", userschema)