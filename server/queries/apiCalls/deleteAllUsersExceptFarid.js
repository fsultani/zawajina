/*
node server/queries/apiCalls/deleteAllUsersExceptFarid.js
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
  if (process.env.NODE_ENV === 'development') {
    try {
      await client.connect();
      const database = client.db('development');
      await database.command({ ping: 1 });
      console.log('Connected successfully to the server');

      const usersQuery = { name: { $ne: 'Farid' } };
      usersCollection = database.collection('users');
      logsCollection = database.collection('logs');
      messagesCollection = database.collection('messages');

      const allUsers = await usersCollection.find(usersQuery).toArray();
      console.log(`Found ${allUsers.length} user accounts`);

      for (const userData of allUsers) {
        const userIdString = userData._id.toString();

        if (userData.photos?.length > 0) {
          await cloudinary.v2.api.resources({ max_results: 10 }, async (resourcesError, resourcesResults) => {
            if (resourcesError) return resourcesError;
            if (resourcesResults.resources.length > 0) {
              resourcesResults.resources
                .filter(item => item.folder === userIdString && item.folder.startsWith(`${process.env.NODE_ENV}/`))
                .map(item => {
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
              root_foldersResults.folders
                .filter(folder => folder.name === userIdString && item.name === process.env.NODE_ENV)
                .map(folder => {
                  cloudinary.v2.api.delete_folder(folder.name, function (error, result) {
                    if (error) return console.log('error:\n', error);
                    console.log(`result - server/queries/apiCalls/deleteUser.js:64\n`, result);
                  });
                });
            }
          });
        }
      }

      const allUserIDs = allUsers.map(user => user._id);
      usersCollection.deleteMany({ _id: { $in: allUserIDs } });
      messagesCollection.deleteMany();
      logsCollection.deleteMany({ _id: { $in: allUserIDs } });

      console.log(`${allUserIDs.length} accounts deleted`);

      const queryFarid = { name: { $regex: /farid/i } };
      await usersCollection.findOneAndUpdate(queryFarid, {
        $set: {
          blockedUsers: [],
          usersLiked: [],
          likedByUsers: [],
        },
      });

      const userFarid = await usersCollection.findOne(queryFarid);
      const remainingLogsQuery = { _id: { $ne: userFarid._id } };
      const remainingLogs = await logsCollection.find(remainingLogsQuery).toArray();

      if (remainingLogs.length > 0) {
        const allUserIDs = remainingLogs.map(user => user._id);
        logsCollection.deleteMany({ _id: { $in: allUserIDs } });

        console.log(`${remainingLogs.length} remaining logs deleted`);
      };

      await client.close();
    } catch (error) {
      console.log(`error - server/queries/apiCalls/deleteAllUsersExceptFarid.js:101\n`, error);
      process.exit(1);
    }
  }
})();
