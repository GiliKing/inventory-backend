import cloudinary from 'cloudinary';

// Configure Cloudinary using your API credentials
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,  
    api_key: process.env.CLOUD_API_KEY,      
    api_secret: process.env.CLOUD_API_SECRET 
});

export default cloudinary;