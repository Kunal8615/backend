import { v2 as cloud} from "cloudinary";
import { log } from "console";
import fs from "fs"
cloud.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET 
});
const uploadonCloundinary = async (localfilepath)=>{
    try {
        if(!localfilepath) return null
        //upload file on clooudinary
        const response = await cloud.uploader.upload(localfilepath,{
            resource_type : "auto"
        })
   
        
      //  console.log("file upload succesfully on cloudinary",response.url);
      fs.unlinkSync(localfilepath)
        return response
    } catch (error) {
        fs.unlinkSync(localfilepath)
    } 
}
export {uploadonCloundinary}