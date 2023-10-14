/*
node server/queries/apiCalls/deleteAllUsers.js
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
      console.log('Connected successfully to server');

      usersCollection = database.collection('users');
      logsCollection = database.collection('logs');
      messagesCollection = database.collection('messages');

      const allUsers = await usersCollection.find().toArray();
      console.log(`Found ${allUsers.length} user accounts`);

      usersCollection.deleteMany();
      console.log(`Dropped usersCollection`);

      messagesCollection.deleteMany();
      console.log(`Dropped messagesCollection`);

      logsCollection.deleteMany();
      console.log(`Dropped logsCollection`);

      await cloudinary.v2.api.resources({ max_results: 10 }, async (resourcesError, resourcesResults) => {
        if (resourcesError) return resourcesError;
        if (resourcesResults.resources.length > 0) {
          resourcesResults.resources
            .filter(item => item.folder.startsWith(`${process.env.NODE_ENV}/`))
            .map(item => {
              cloudinary.v2.uploader.destroy(item.public_id, function (destroyError, destroyResult) {
                if (destroyError) return console.log('destroyError:\n', destroyError);
                console.log('destroyResult:\n', destroyResult);
              });
            });
        }
      });

      await cloudinary.v2.api.root_folders(async (root_foldersError, root_foldersResults) => {
        if (root_foldersError) return root_foldersError;
        if (root_foldersResults.folders.length > 0) {
          root_foldersResults.folders
            .filter(item => item.name === process.env.NODE_ENV)
            .map(folder => {
              cloudinary.v2.api.delete_folder(folder.name, function (error, result) {
                if (error) return console.log('error:\n', error);
                console.log('result:\n', result);
              });
            });
        }
      });

      await client.close();
      console.log(`Close client`);
    } catch (error) {
      console.log(`error - server/queries/apiCalls/deleteAllUsers.js:92\n`, error);
      process.exit(1);
    }
  }
})();
