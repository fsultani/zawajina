require('dotenv').config();
const { MongoClient } = require("mongodb");
const cloudinary = require("cloudinary");

require('../../config/cloudinary');

const uri = process.env.MONGODB_URI;

(async () => {
  await cloudinary.v2.api.resources({ max_results: 10 }, async (error, results) => {
    const destroyImages = results.resources.map(item => {
      cloudinary.v2.uploader.destroy(item.public_id, function (error, result) {
        if (error) return console.log("error:\n", error);
        console.log("result:\n", result);
      });
    });

    await Promise.all(destroyImages);
  });

  await cloudinary.v2.api.root_folders(async (error, results) => {
    results.folders.map(folder => {
      cloudinary.v2.api.delete_folder(folder.name, function (error, result) {
        if (error) return console.log("error:\n", error);
        console.log("result:\n", result);
      });
    });
  });

  MongoClient.connect(
    uri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    async (err, client) => {
      if (err) {
        console.log(`err\n`, err);
        client.close();
        throw err;
      }
      const db = client.db("my-match-dev");
      await db.collection("users").drop();
      client.close();
    }
  );
})();
