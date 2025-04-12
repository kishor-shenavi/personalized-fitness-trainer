// // scripts/uploadPosesToCloudinary.js
// require('dotenv').config();
// const cloudinary = require('../utils/cloudinary');
// const Pose = require('../models/Pose');
// const fs = require('fs');
// const path = require('path');

// async function migrateImages() {
//   try {
//     const poses = await Pose.find({});
    
//     for (const pose of poses) {
//       if (pose.image.startsWith('/images/poses/')) {
//         const imagePath = path.join(__dirname, '../public', pose.image);
        
//         if (fs.existsSync(imagePath)) {
//           const result = await cloudinary.uploader.upload(imagePath, {
//             folder: 'yoga-poses',
//             public_id: pose.name.toLowerCase().replace(/[^\w]/g, '-')
//           });
          
//           pose.image = result.secure_url;
//           await pose.save();
//           console.log(`Uploaded ${pose.name}`);
//         } else {
//           console.warn(`File not found: ${imagePath}`);
//         }
//       }
//     }
    
//     console.log('Migration complete!');
//   } catch (err) {
//     console.error('Migration failed:', err);
//   }
// }

// migrateImages();