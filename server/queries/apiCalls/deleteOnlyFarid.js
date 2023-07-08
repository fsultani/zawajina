/*
node server/queries/apiCalls/deleteOnlyFarid.js
*/

require('dotenv').config();
const { MongoClient } = require('mongodb');
const cloudinary = require('cloudinary');

require('../../config/cloudinary');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let usersCollection;
let logsCollection;
let messagesCollection;

(async () => {
  try {
    await client.connect();
    const database = client.db('development');
    await database.command({ ping: 1 });
    console.log('Connected successfully to server');

    const usersQuery = { name: { $regex: /farid/i } };
    usersCollection = database.collection('users');
    logsCollection = database.collection('logs');
    messagesCollection = database.collection('messages');

    const userFarid = await usersCollection.find(usersQuery).toArray();
    console.log(`Found ${userFarid.length} user account`);

    for (const userData of userFarid) {
      const userId = userData._id;
      const userIdString = userData._id.toString();

      if (userData.photos?.length > 0) {
        await cloudinary.v2.api.resources({ max_results: 10 }, async (resourcesError, resourcesResults) => {
          if (resourcesError) return resourcesError;
          if (resourcesResults.resources.length > 0) {
            resourcesResults.resources.filter(item => item.folder === userIdString).map(item => {
              cloudinary.v2.uploader.destroy(item.public_id, function (destroyError, destroyResult) {
                if (destroyError) return console.log('destroyError:\n', destroyError);
                console.log(`destroyResult - server/queries/apiCalls/deleteUser.js:51\n`, destroyResult);
              });
            });
          }
        });
  
        await cloudinary.v2.api.root_folders(async (root_foldersError, root_foldersResults) => {
          if (root_foldersError) return root_foldersError;
          if (root_foldersResults.folders.length > 0) {
            root_foldersResults.folders.filter(folder => folder.name === userIdString).map(folder => {
              cloudinary.v2.api.delete_folder(folder.name, function (error, result) {
                if (error) return console.log('error:\n', error);
                console.log(`result - server/queries/apiCalls/deleteUser.js:64\n`, result);
              });
            });
          }
        });
      }

      await usersCollection.deleteOne({ _id: userId });

      await messagesCollection.deleteMany({
        $or: [
          {
            recipientId: userId,
          },
          {
            createdByUserId: userId
          }
        ]
      });

      const logsCursor = await logsCollection.findOne({ _id: userId });

      if (logsCursor) {
        await logsCollection.deleteOne({ _id: userId });

        const index = userFarid.indexOf(userData);
        console.log(`${index + 1} of ${userFarid.length} user accounts deleted`);
      }
    }

    await client.close();
    console.log(`Close client`);
  } catch (error) {
    console.log(`error - server/queries/apiCalls/deleteOnlyFarid.js:91\n`, error);
    process.exit(1);
  }
})();
