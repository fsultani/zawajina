const { MongoClient } = require('mongodb');

let db;
const connectToServer = callback => {
  if (!db) {
    MongoClient.connect(
      process.env.MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err, client) => {
        if (err) throw err;
        db = client.db();
        return callback(err, db);
      }
    );
  } else {
    return callback(null);
  }
};

const usersCollection = () => db.collection('users');
const messagesCollection = () => db.collection('messages');

module.exports = {
  connectToServer,
  usersCollection,
  messagesCollection,
  db,
};
