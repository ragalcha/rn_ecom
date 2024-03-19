import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        //file has been uploaded successfully
        // console log krke dekhna
        // console.log("file is uploaded on clodinary", response);
        // console.log("file is uploaded on clodinary", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
};

const deleteFromCloudinary = async (fileName) => {
    try {
        const result = await cloudinary.uploader.destroy(fileName);
        // console.log(result);
    } catch (error) {
        console.error("Error while deleting file from clodinary:", error);
    }

    // first I tried this method and it worked but it is file specific
    // const response = await cloudinary.api.delete_resources([fileName], {
    //     type: 'upload', resource_type: "image",
    // });
    // console.log(response);
};

export { uploadOnCloudinary, deleteFromCloudinary };
