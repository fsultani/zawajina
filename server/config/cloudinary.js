const cloudinary = require('cloudinary').v2;

module.exports = cloudinary.config({
  cloud_name: process.env.NODE_ENV === 'localhost'
    ? require('../credentials.json').CLOUDINARY_CLOUD_NAME
    : process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NODE_ENV === 'localhost'
    ? require('../credentials.json').CLOUDINARY_API_KEY
    : process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.NODE_ENV === 'localhost'
    ? require('../credentials.json').CLOUDINARY_API_SECRET
    : process.env.CLOUDINARY_API_SECRET,
});