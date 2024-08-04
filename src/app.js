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
//ROUTERS DECLEATION by middleware
app.use("/api/v1/users",userrouter)
export {app}