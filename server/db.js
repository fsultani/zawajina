// const { MongoClient } = require('mongodb');

// const uri = process.env.DEVELOPMENT
//   ? 'mongodb+srv://fsultani:asdf@my-match.rxspi.mongodb.net/my-match-dev?retryWrites=true&w=majority'
//   : process.env.MONGODB_URI;

// let db;
// const connectToServer = callback => {
//   if (!db) {
//     MongoClient.connect(
//       uri,
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       },
//       (err, client) => {
//         if (err) throw err;
//         db = client.db('my-match-dev');
//         return callback(err);
//       }
//     );
//   } else {
//     return callback(null);
//   }
// };

// const usersCollection = () => db.collection('users');
// const messagesCollection = () => db.collection('messages');
// const messagesAggregate = (...args) => db.collection('messages').aggregate(...args)

// module.exports = {
//   connectToServer,
//   usersCollection,
//   messagesCollection,
//   messagesAggregate,
//   db,
// };

/* Local db */

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017/my_match_local';

let db;
const connectToServer = callback => {
  if (!db) {
    MongoClient.connect(
      uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err, client) => {
        if (err) throw err;
        db = client.db();
        return callback(err);
      }
    );
  } else {
    return callback(null);
  }
};

const usersCollection = () => db.collection('users');
const messagesCollection = () => db.collection('messages');
const messagesAggregate = (...args) => db.collection('messages').aggregate(...args)

module.exports = {
  connectToServer,
  usersCollection,
  messagesCollection,
  messagesAggregate,
  db,
};
