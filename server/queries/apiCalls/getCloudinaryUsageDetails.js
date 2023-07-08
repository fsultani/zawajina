// node server/queries/apiCalls/getCloudinaryUsageDetails.js

const cloudinary = require('cloudinary');
require('../../config/cloudinary');

cloudinary.v2.api.usage().then(result => console.log(result));
