import  express  from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express()

app.use(cors({
        origin:process.env.CROS_ORIGIN,
        credentials:true
}))

//security practis

app.use(express.json({limit : "30mb"}))
app.use(express.urlencoded({extended:true,limit : "30mb"}))
app.use(express.static("public"))

app.use(cookieParser())


//routes

import userrouter from "./routes/user.route.js"
import tweetroute from "../src/routes/tweet.route.js"
import likeroute from "../src/routes/like.route.js"
import commentroute from "../src/routes/comment.route.js"
import videoroute from "../src/routes/video.route.js"
import dashboard from "../src/routes/dashboard.route.js"
//ROUTERS DECLEATION by middleware
app.use("/api/v1/users",userrouter)
app.use("/api/v1/comment",commentroute)
app.use("/api/v1/comment/tweet",tweetroute)
app.use("/api/v1/comment/like",likeroute)
app.use("/api/v1/comment/video",videoroute)
app.use("/api/v1/comment/dashboard",dashboard)

export {app}