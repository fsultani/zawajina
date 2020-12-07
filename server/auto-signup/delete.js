const cloudinary = require('cloudinary');
const mongoose = require('mongoose');
const User = require('../models/user');

cloudinary.config({
  cloud_name: require('/Users/farid/_repos/tutor/server/routes/credentials.json').cloudinaryCloudName,
  api_key: require('/Users/farid/_repos/tutor/server/routes/credentials.json').cloudinaryApiKey,
  api_secret: require('/Users/farid/_repos/tutor/server/routes/credentials.json').cloudinaryApiSecret,
});

// cloudinary.v2.api.resources({ max_results: 100 }, (error, results) => {
//   const mongodbConnect = mongoose.connect('mongodb+srv://fsultani:asdf@my-match.rxspi.mongodb.net/my-match-dev?retryWrites=true&w=majority')
//   if (error) throw error;
//   User.findOne({ name: 'Farid' }, (err, user) => {
//     const mongooseUserId = user._id.toString();
//     results.resources.map(item => {
//       const cloudinaryUserId = item.public_id.split('/')[0];
//       if (cloudinaryUserId !== mongooseUserId) {
//         cloudinary.v2.uploader.destroy(item.public_id, function(error, result) {
//           if (error) return console.log('error:\n', error);
//           console.log('result:\n', result);
//         });
//       }
//     })

//     mongoose.connection.close();

//     cloudinary.v2.api.root_folders((error, results) => {
//       console.log('results:\n', results);
//       results.folders.map(folder => {
//         cloudinary.v2.api.delete_folder(folder.name, function(error, result) {
//           if (error) return console.log('error:\n', error);
//           console.log('result:\n', result);
//         });
//       })
//     })
//   })
// });

cloudinary.v2.api.delete_all_resources(function(error, result) {console.log(result, error)});
cloudinary.v2.api.root_folders((error, results) => {
  console.log('results:\n', results);
  results.folders.map(folder => {
    cloudinary.v2.api.delete_folder(folder.name, function(error, result) {
      if (error) return console.log('error:\n', error);
      console.log('result:\n', result);
    });
  })
})
