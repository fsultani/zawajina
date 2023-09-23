const { compress } = require('compress-images/promise');
const fs = require('fs');
const { returnServerError } = require('../utils');

require('../config/cloudinary');

const deleteFromCloudinary = async ({ publicIds }) => {
  try {
    const cloudinary = require('cloudinary');

    const response = await cloudinary.v2.api.delete_resources(publicIds, {
      invalidate: true
    });
    return response;
  } catch (error) {
    returnServerError(res, error);
  }
};

const uploadToCloudinary = async ({ req, userId }) => {
  try {
    const cloudinary = require('cloudinary');

    let photos = [];
    const userImages = Object.values(req.files).map(async (image, _) => {
      const file = image[0];
      const fileIndex = file.fieldname.split('-')[1]
      const result = await compress({
        source: file.path,
        destination: 'compressed/',
        enginesSetup: {
          jpg: {
            engine: 'mozjpeg',
            command: ['-quality', '60']
          },
          png: {
            engine: 'pngquant',
            command: ['--quality=20-50', '-o']
          },
        },
        params: {
          statistic: false,
        }
      });

      const { statistics, errors } = result;
      if (errors.length > 0) return new Error('Error in uploadToCloudinary');
      const upload = await cloudinary.v2.uploader.upload(statistics[0].path_out_new, {
        folder: `${process.env.NODE_ENV}/${userId}`,
      });

      const uploadResponse = {
        index: Number(fileIndex),
        public_id: upload.public_id,
        secure_url: upload.secure_url,
        approvalStatus: 'Approved',
      }

      photos.push({
        ...uploadResponse
      });
    })

    await Promise.all(userImages);

    fs.readdirSync('uploads').forEach(f => fs.rmSync(`uploads/${f}`));
    fs.readdirSync('compressed').forEach(f => fs.rmSync(`compressed/${f}`));
    return photos;
  } catch (error) {
    returnServerError(res, error);
  }
};

module.exports = {
  deleteFromCloudinary,
  uploadToCloudinary,
}
