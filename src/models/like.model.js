import mongoose, { mongo, Schema } from "mongoose";

const likeschema = new Schema(
    {
        video : {
            type : Schema.Types.ObjectId,
            ref : "Video"
        },
        comment: {
            type : Schema.Types.ObjectId,
            ref : "Comment"
        },
        tweet : {
            type : Schema.Types.ObjectId,
            ref : "Tweet"
        },
        LikedBy : {
            type : Schema.Types.ObjectId,
            ref : "User"
        }

    }
    , { timestamps: true })

    export const Like = mongoose.model("Like",likeschema)