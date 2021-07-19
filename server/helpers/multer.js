const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    const random =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const fileExtension = file.originalname.split('.')[1];
    cb(null, `${random}.${fileExtension}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
