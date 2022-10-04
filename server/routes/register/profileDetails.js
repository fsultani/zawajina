const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');
const { compress } = require('compress-images/promise');

const { usersCollection, insertLogs } = require('../../db.js');

const uploadToCloudinary = async ({ req, userId }) => {
  try {
    const cloudinary = require('cloudinary');
    require('../../config/cloudinary');

    let photos = [];
    const userImages = Object.values(req.files).map(async (image, index) => {
      const file = image[0];
      const result = await compress({
        source: file.path,
        destination: 'compressed/',
        enginesSetup: {
          jpg: { engine: 'mozjpeg', command: ['-quality', '60'] },
          png: { engine: 'pngquant', command: ['--quality=20-50', '-o'] },
        },
        params: {
          statistic: false,
        }
      });

      const { statistics, errors } = result;
      if (errors.length > 0) return new Error('Error in uploadToCloudinary');
      const upload = await cloudinary.v2.uploader.upload(statistics[0].path_out_new, {
        folder: userId,
      });

      const uploadResponse = {
        index,
        asset_id: upload.asset_id,
        public_id: upload.public_id,
        version: upload.version,
        version_id: upload.version_id,
        signature: upload.signature,
        width: upload.width,
        height: upload.height,
        format: upload.format,
        resource_type: upload.resource_type,
        created_at: upload.created_at,
        tags: upload.tags,
        bytes: upload.bytes,
        type: upload.type,
        etag: upload.etag,
        placeholder: upload.placeholder,
        url: upload.url,
        secure_url: upload.secure_url,
        original_filename: upload.original_filename,
        api_key: upload.api_key,
      }

      photos.push({ ...uploadResponse });
    })

    await Promise.all(userImages);

    fs.readdirSync('uploads').forEach(f => fs.rmSync(`uploads/${f}`));
    fs.readdirSync('compressed').forEach(f => fs.rmSync(`compressed/${f}`));
    return photos;
  } catch (error) {
    console.error(`uploadToCloudinary\n`, error);
    throw error;
  }
};

const profileDetails = async (req, res) => {
  try {
    const { userId } = req.body;
    const {
      birthMonth,
      birthDay,
      birthYear,
      gender,
      country,
      state,
      city,
      ethnicity,
      countryRaisedIn,
      languages,
      religiousConviction,
      religiousValues,
      maritalStatus,
      education,
      profession,
      hijab,
      hasChildren,
      wantsChildren,
      height,
      canRelocate,
      diet,
      smokes,
      hobbies,
      aboutMe,
      aboutMyMatch,
      userIPAddress,
    } = JSON.parse(req.body.userInfo);

    const fullDob = `${birthMonth}/${birthDay}/${birthYear}`;
    const today = new Date();
    const dob = new Date(fullDob);
    let age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth() - dob.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
      age = age - 1;
    }

    let photos = [];
    if (req.files && Object.values(req.files).length > 0) {
      const response = await uploadToCloudinary({ req, userId });
      const upload = response.map(item => ({
        ...item,
        isApproved: true,
      }))
      upload.sort((a, b) => a.index - b.index);
      photos = [...upload];
    }

    const userObject = {
      fullDob,
      age,
      gender,
      country,
      state,
      city,
      photos,
      ethnicity,
      countryRaisedIn,
      languages,
      religiousConviction,
      religiousValues,
      maritalStatus,
      education,
      profession,
      hijab,
      hasChildren,
      wantsChildren,
      height,
      canRelocate,
      diet,
      smokes,
      hobbies,
      aboutMe,
      aboutMyMatch,
    }

    usersCollection().findOneAndUpdate(
      { _id: ObjectId(userId) },
      {
        $set: {
          ...userObject,
          completedRegistrationAt: new Date(),
        },
      },
      { new: true },
      async (err, user) => {
        if (err) return res.send({ error: err });

        const endpoint = req.originalUrl;
        await insertLogs({
          ...userObject,
        },
          userIPAddress,
          endpoint,
          userId
        );
        const token = jwt.sign({ my_match_userId: user.value._id }, JWT_SECRET, {
          expiresIn: '1 day',
        });
        res.status(201).json({ token });
      }
    );
  } catch (error) {
    console.log(`profileDetails error\n`, error);
    res.send({ error });
    throw error;
  }
};

module.exports = profileDetails;
