import mongoose, { Schema } from "mongoose"

const videoschema = new Schema(
    {
        videofile : {
            type : String, //cloudaniary
            required : true
        },
        thumbnail : {
            type : String, //cloudaniary
            required : true
        },
        title : {
            type : String, 
            required : true
        },
        description : {
            type : String, 
            required : true
        },
        duration : {
            type : Number,
            required : true
        },

        views :{
            type: Number,
            default : 0
        },
        ispublished:{
            type : Boolean,
            default :true
        },
        owner :{
            type : Schema.Types.ObjectId,
            ref :"User"
        }
    },
    {timestamps:true})

export const Video = mongoose.model("Video",videoschema)