import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./database/index.js";
import { app } from "./app.js";

connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`server is running  ${process.env.PORT}`);
  })
})
.catch((e)=>{
  console.log("failed connection" , e);
})





/*
1ST APPROCH 
import  express  from "express";
const app = express()
//if es
;(async()=>{
    try{
      await  mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME} `)
      app.on("error",()=>{
        console.log("error");
        throw error
      })  //listen events

        app.listen(process.env.PORT,()=>{
            console.log(`listening on ${process.env.PORT} `);
        })

    }catch(e){
        console.log("error", e)
        throw err
    }
})()

*/