const { MongoClient, ObjectId } = require("mongodb");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");
const User = require("../models/user");

cloudinary.config({
  cloud_name: require("/Users/farid/_repos/my-match/server/credentials.json").CLOUDINARY_CLOUD_NAME,
  api_key: require("/Users/farid/_repos/my-match/server/credentials.json").CLOUDINARY_API_KEY,
  api_secret: require("/Users/farid/_repos/my-match/server/credentials.json").CLOUDINARY_API_SECRET,
});

const uri =
  "mongodb+srv://fsultani:asdf@my-match.rxspi.mongodb.net/my-match-dev?retryWrites=true&w=majority";

MongoClient.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) throw err;
    const db = client.db("my-match-dev");
    const users = db.collection("users").find({ $or:
      [
        { name: { $regex: "Farid" } },
        { name: { $regex: "Soon Tobe Yours" } },
        { name: { $regex: "Habibie" } },
      ]});

    users.forEach(user => {
      const userId = user._id.toString();
      cloudinary.v2.api.resources({ max_results: 10 }, (error, results) => {
        results.resources.map(item => {
          const cloudinaryUserId = item.public_id.split("/")[0];
          if (cloudinaryUserId !== userId) {
            cloudinary.v2.uploader.destroy(item.public_id, function (error, result) {
              if (error) return console.log("error:\n", error);
              console.log("result:\n", result);
            });
          }
        });
      });

      cloudinary.v2.api.root_folders((error, results) => {
        results.folders.map(folder => {
          if (folder.name !== userId) {
            console.log("folder:\n", folder);
            cloudinary.v2.api.delete_folder(folder.name, function (error, result) {
              if (error) return console.log("error:\n", error);
              console.log("result:\n", result);
            });
          }
        });
      });

      client.close();
    })
  }
);

// MongoClient.connect(
//   uri,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   (err, client) => {
//     if (err) throw err;
//     const db = client.db("my-match-dev");
//     db.collection("users").findOne({ name: { $regex: "Farid" } }, (err, user) => {
//       if (err) console.log("err:\n", err);
//       if (!user) {
//         cloudinary.v2.api.delete_all_resources(function (error, result) {
//           console.log(result, error);
//         });
//         cloudinary.v2.api.root_folders((error, results) => {
//           console.log("results:\n", results);
//           results.folders.map(folder => {
//             cloudinary.v2.api.delete_folder(folder.name, function (error, result) {
//               if (error) return console.log("error:\n", error);
//               console.log("result:\n", result);
//             });
//           });
//         });
//       } else {
//         const userId = user._id.toString();
//         cloudinary.v2.api.resources({ max_results: 10 }, (error, results) => {
//           results.resources.map(item => {
//             const cloudinaryUserId = item.public_id.split("/")[0];
//             if (cloudinaryUserId !== userId) {
//               cloudinary.v2.uploader.destroy(item.public_id, function (error, result) {
//                 if (error) return console.log("error:\n", error);
//                 console.log("result:\n", result);
//               });
//             }
//           });
//         });

//         cloudinary.v2.api.root_folders((error, results) => {
//           results.folders.map(folder => {
//             if (folder.name !== userId) {
//               console.log("folder:\n", folder);
//               cloudinary.v2.api.delete_folder(folder.name, function (error, result) {
//                 if (error) return console.log("error:\n", error);
//                 console.log("result:\n", result);
//               });
//             }
//           });
//         });
//       }
//       client.close();
//     });
//   }
// );

// cloudinary.v2.api.delete_all_resources((error, result) => {
//   console.log(result, error);
// });

// cloudinary.v2.api.root_folders((error, results) => {
//   console.log('results:\n', results);
//   results.folders.map(folder => {
//     cloudinary.v2.api.delete_folder(folder.name, function(error, result) {
//       if (error) return console.log('error:\n', error);
//       console.log('result:\n', result);
//     });
//   })
// })
