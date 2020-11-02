const aws = require("aws-sdk");
const fs = require("fs");
const mongoose = require("mongoose");
const User = require("../models/user");

const mongodbConnect = mongoose.connect("mongodb+srv://fsultani:asdf@my-match.rxspi.mongodb.net/my-match-dev?retryWrites=true&w=majority");

const s3 = new aws.S3({
  accessKeyId: require("/Users/farid/_repos/tutor/server/routes/s3Credentials.json").accessKeyId,
  secretAccessKey: require("/Users/farid/_repos/tutor/server/routes/s3Credentials.json").SECRETACCESSKEY,
});

function emptyBucket(bucketName){
  const params = {
    Bucket: bucketName,
  };

  s3.listObjects(params, function(err, data) {
    if (err) {
      console.log('err:\n', err);
    }

    data.Contents.forEach(function(content) {
      User.findOne({ name: 'Farid' }, (err, user) => {
        const userId = content.Key.split('/')[0]
        if (userId !== user.id) {
          if (content.Key !== 'male.png' && content.Key !== 'female.png') {
            console.log('content.Key:\n', content.Key);
            s3.deleteObject({
              Bucket: bucketName,
              Key: content.Key
            }).promise()
          }
        }
        mongoose.connection.close();
      })
    });
  });
}

emptyBucket('my-match');
