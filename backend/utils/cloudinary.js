// require('dotenv').config();
// const cloudinary = require('cloudinary').v2;

// // Configuration
// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true
// });

// // Utility functions
// module.exports = {
//   /**
//    * Upload an image to Cloudinary
//    * @param {String} filePath - Path to the image file
//    * @param {String} folder - Folder to upload to (default: 'yoga-poses')
//    * @returns {Promise<Object>} Cloudinary upload result
//    */
//   uploadImage: async (filePath, folder = 'yoga-poses') => {
//     try {
//       const result = await cloudinary.uploader.upload(filePath, {
//         folder,
//         use_filename: true,
//         unique_filename: true
//       });
//       return result;
//     } catch (error) {
//       console.error('Upload error:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get all image URLs from a folder
//    * @param {String} folder - Folder to scan (default: 'yoga-poses')
//    * @returns {Promise<Array>} Array of image URLs
//    */
//   getAllImageUrls: async (folder = 'yoga-poses') => {
//     try {
//       const result = await cloudinary.api.resources({
//         type: 'upload',
//         prefix: folder,
//         max_results: 500
//       });
//       return result.resources.map(resource => resource.secure_url);
//     } catch (error) {
//       console.error('Error fetching URLs:', error);
//       return [];
//     }
//   },

//   /**
//    * Delete an image from Cloudinary
//    * @param {String} publicId - The public ID of the image
//    * @returns {Promise<Object>} Deletion result
//    */
//   deleteImage: async (publicId) => {
//     try {
//       return await cloudinary.uploader.destroy(publicId);
//     } catch (error) {
//       console.error('Deletion error:', error);
//       throw error;
//     }
//   },

//   // Expose the cloudinary instance if needed
//   cloudinary
// };