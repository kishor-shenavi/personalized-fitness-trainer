// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '../.env') });
// const cloudinary = require('../utils/cloudinary');
// const mongoose = require('mongoose');
// const Pose = require('../models/Pose');

// // Mapping of pose names to Cloudinary public_ids
// const POSE_MAPPING = {
//   'Tadasana (Mountain Pose)': 'yoga-poses/Tadasana_jjicby',
//   'Vrikshasana (Tree Pose)': 'yoga-poses/Vrikshasana_abc123',
//   'Bhujangasana (Cobra Pose)': 'yoga-poses/Bhujangasana_def456',
//   // Add all other poses with their exact Cloudinary public_ids
//   // Format: 'Pose Name': 'folder/filename_without_extension'
// };

// async function migrateWithRateLimiting() {
//   try {
//     console.log('Connecting to MongoDB...');
//     await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 5000
//     });
//     console.log('✅ Connected to MongoDB');

//     const poses = await Pose.find({});
//     console.log(`Found ${poses.length} poses to process`);

//     // Process in batches with delays to avoid rate limits
//     const BATCH_SIZE = 5;
//     const DELAY_MS = 1500;

//     for (let i = 0; i < poses.length; i += BATCH_SIZE) {
//       const batch = poses.slice(i, i + BATCH_SIZE);
      
//       await Promise.all(batch.map(async (pose) => {
//         try {
//           console.log(`Processing ${pose.name} (ID: ${pose._id})...`);

//           // Skip if already has Cloudinary URL
//           if (pose.cloudinary_url) {
//             console.log(`ℹ️ Already has Cloudinary URL: ${pose.name}`);
//             return;
//           }

//           // Get Cloudinary public_id from mapping
//           const publicId = POSE_MAPPING[pose.name];
//           if (!publicId) {
//             console.log(`⚠️ No Cloudinary mapping for ${pose.name}`);
//             return;
//           }

//           // Get Cloudinary resource
//           const resource = await cloudinary.api.resource(publicId)
//             .catch(err => {
//               if (err.error.http_code === 404) {
//                 console.log(`❌ Image not found: ${publicId}`);
//                 return null;
//               }
//               throw err;
//             });

//           if (resource) {
//             pose.cloudinary_url = resource.secure_url;
//             await pose.save();
//             console.log(`✅ Updated ${pose.name} with Cloudinary URL`);
//           }
//         } catch (err) {
//           console.error(`🚨 Error processing ${pose.name}:`, err.message);
//         }
//       }));

//       // Rate limit delay
//       if (i + BATCH_SIZE < poses.length) {
//         console.log(`⏳ Waiting ${DELAY_MS}ms to avoid rate limits...`);
//         await new Promise(resolve => setTimeout(resolve, DELAY_MS));
//       }
//     }

//     console.log('✅ Migration complete!');
//   } catch (err) {
//     console.error('❌ Migration failed:', err);
//     process.exit(1);
//   } finally {
//     await mongoose.disconnect();
//     process.exit(0);
//   }
// }

// // First verify Cloudinary credentials
// cloudinary.api.ping()
//   .then(() => migrateWithRateLimiting())
//   .catch(err => console.error('Cloudinary connection failed:', err));