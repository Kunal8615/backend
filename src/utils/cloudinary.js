import { v2 as cloud} from "cloudinary";
import { log } from "console";
import fs from "fs"


cloud.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET // Click 'View Credentials' below to copy your API secret
});

const uploadonCloundinary = async (localfilepath)=>{
    try {
        if(!localfilepath) return null
        //upload file on clooudinary
        const response = await cloud.uploader.upload(localfilepath,{
            resource_type : "auto"
        })
        ///has succesfullay uploaded
        console.log("file upload succesfully on cloudinary",response.url);
        return response
    } catch (error) {
        //REMOVE LOCAL SAVE TEMP FILE AAS OPERATION GOT FAILED
        fs.unlinkSync(localfilepath)
    } 
}
export {uploadonCloundinary}