require('dotenv').config();
const { cloudinary, getAllImageUrls } = require('./utils/cloudinary');

async function testCloudinary() {
  try {
    console.log('Testing Cloudinary connection...');
    
    // 1. Test the connection
    const ping = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful:', ping);
    
    // 2. Get all image URLs from yoga-poses folder
    console.log('\nFetching all image URLs...');
    const urls = await getAllImageUrls();
    
    console.log(`\nFound ${urls.length} images:`);
    urls.forEach((url, i) => console.log(`${i+1}. ${url}`));
    
    // 3. Save URLs to a JSON file
    const fs = require('fs');
    fs.writeFileSync('cloudinary_urls.json', JSON.stringify(urls, null, 2));
    console.log('\n✅ URLs saved to cloudinary_urls.json');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCloudinary();