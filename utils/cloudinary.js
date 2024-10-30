const cloudinary = require('cloudinary').v2;


// Function to upload from the disk Storage
// async function uploadToCloud(filePath) {

//     // Configuration
//     cloudinary.config({
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET
//     });

//     // Upload an image
//     const uploadResult = await cloudinary.uploader
//         .upload(
//             filePath, {
//             resource_type: "auto"
//         }
//         )
//         .catch((error) => {
//             console.log(error);
//         });

//     // console.log(uploadResult);

//     return uploadResult;

//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });

//     console.log(optimizeUrl);

//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });

//     console.log(autoCropUrl);
// }

// Function to upload from the Memory Buffer
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload a file buffer to Cloudinary
async function uploadToCloud(buffer) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) {
                    console.error("Error uploading to Cloudinary:", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        ).end(buffer); // Send the buffer data to Cloudinary
    });
}

module.exports = uploadToCloud;