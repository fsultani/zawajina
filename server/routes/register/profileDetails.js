const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Jimp = require('jimp');

const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

const { usersCollection } = require('../../db.js');
const sendEmail = require('../../helpers/email');

const profileDetails = (req, res) => {
  const userId = req.body.userId;
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
    relocate,
    diet,
    smokes,
    hobbies,
    aboutMe,
    aboutMyMatch,
  } = JSON.parse(req.body.userInfo);

  const fullDob = `${birthMonth}/${birthDay}/${birthYear}`;
  const today = new Date();
  const dob = new Date(fullDob);
  let age = today.getFullYear() - dob.getFullYear();
  const month = today.getMonth() - dob.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
    age = age - 1;
  }

  if (req.files && Object.values(req.files).length > 0) {
    const cloudinary = require('cloudinary').v2;
    require('../../config/cloudinary');
    const allImages = [];
    const userImages = Object.values(req.files).map(async (image, index) => {
      const file = image[0];
      const fileName = file.filename.split('.')[0];
      const compressedFilePath = `compressed/${file.filename.split('.')[0]}.jpg`;
      const jpgImage = await Jimp.read(file.path);
      await jpgImage.cover(640, 640).quality(100).write(compressedFilePath);
      const uploadToCloudinary = await cloudinary.uploader.upload(compressedFilePath, {
        folder: userId,
      });
      allImages.push(uploadToCloudinary.secure_url);
      fs.unlink(file.path, err => {
        if (err) return console.error(err);
        fs.unlink(compressedFilePath, err => {
          if (err) return console.error(err);
        });
      });
    });

    Promise.all(userImages).then(() => {
      usersCollection().findOneAndUpdate(
        { _id: ObjectId(userId) },
        {
          $set: {
            fullDob,
            age,
            gender,
            country,
            state,
            city,
            photos: allImages,
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
            relocate,
            diet,
            smokes,
            hobbies,
            aboutMe,
            aboutMyMatch,
            completedRegistrationAt: new Date(),
            // conversations: [],
            lastLogin: new Date(),
          },
        },
        { new: true },
        (err, user) => {
          const token = jwt.sign({ my_match_userId: user.value._id }, JWT_SECRET, {
            expiresIn: '1 day',
          });
          res.status(201).json({ token });
        }
      );
    });
  } else {
    // const allImagesArray = [
    //   'https://res.cloudinary.com/dnjhw5rv2/image/upload/v1608951248/5fe6a54a2f3fa93aad83aa49/zfucr4bfuoff4aibwvio.jpg',
    //   'https://res.cloudinary.com/dnjhw5rv2/image/upload/v1608951248/5fe6a54a2f3fa93aad83aa49/tmfvnssdmpoz0ct7pq2s.jpg',
    //   'https://res.cloudinary.com/dnjhw5rv2/image/upload/v1608951250/5fe6a54a2f3fa93aad83aa49/m8ygr6hz9i6jvuqig1tv.jpg',
    //   'https://res.cloudinary.com/dnjhw5rv2/image/upload/v1608951250/5fe6a54a2f3fa93aad83aa49/nuyegob47msffx6lzhva.jpg',
    //   'https://res.cloudinary.com/dnjhw5rv2/image/upload/v1608951250/5fe6a54a2f3fa93aad83aa49/h0s34njkv4o7c6krpvms.jpg',
    //   'https://res.cloudinary.com/dnjhw5rv2/image/upload/v1608951251/5fe6a54a2f3fa93aad83aa49/jekn1peld8nzaan5jgsy.jpg'
    // ]

    // const images = Array(allImagesArray.length).fill().map((_, index) => index);
    // images.sort(() => Math.random() - 0.5);
    // const allImages = []
    // images.map(number => allImages.push(allImagesArray[number]))

    usersCollection().findOneAndUpdate(
      { _id: ObjectId(userId) },
      {
        $set: {
          fullDob,
          age,
          gender,
          country,
          state,
          city,
          // photos: allImages,
          photos: [],
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
          relocate,
          diet,
          smokes,
          hobbies,
          aboutMe,
          aboutMyMatch,
          completedRegistrationAt: new Date(),
          // conversations: [],
          lastLogin: new Date(),
        },
      },
      { new: true },
      (err, user) => {
        if (err) return res.send({ error: err });
        const token = jwt.sign({ my_match_userId: user.value._id }, JWT_SECRET, {
          expiresIn: '1 day',
        });
        res.status(201).json({ token });
      }
    );
  }
};

module.exports = profileDetails;
