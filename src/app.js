import  express  from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express()

app.use(cors({
        origin:'http://localhost:5173',
        credentials:true
}))

//security practis

app.use(express.json({limit : "30mb"}))
app.use(express.urlencoded({extended:true,limit : "30mb"}))
app.use(express.static("public"))
app.use(express.json())
app.use(cookieParser())


//routes

import userrouter from "./routes/user.route.js"
import tweetroute from "../src/routes/tweet.route.js"
import likeroute from "../src/routes/like.route.js"
import commentroute from "../src/routes/comment.route.js"
import videoroute from "../src/routes/video.route.js"
import dashboard from "../src/routes/dashboard.route.js"
import playlistroute from "../src/routes/playlist.route.js"
import subscriberroute from "../src/routes/subscription.route.js"
//ROUTERS DECLEATION by middleware
app.use("/api/v1/users",userrouter)
app.use("/api/v1/comment",commentroute)
app.use("/api/v1/tweet",tweetroute)
app.use("/api/v1/like",likeroute)
app.use("/api/v1/video",videoroute)
app.use("/api/v1/dashboard",dashboard)
app.use("/api/v1/playlist",playlistroute)
app.use("/api/v1/subscription",subscriberroute)

export {app}