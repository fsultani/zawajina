const cloudinary = require('cloudinary').v2;
const credentials = require('../credentials.json');

module.exports = cloudinary.config({
  cloud_name: process.env.NODE_ENV === 'localhost'
    ? credentials.CLOUDINARY_CLOUD_NAME
    : process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NODE_ENV === 'localhost'
    ? credentials.CLOUDINARY_API_KEY
    : process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.NODE_ENV === 'localhost'
    ? credentials.CLOUDINARY_API_SECRET
    : process.env.CLOUDINARY_API_SECRET,
});
