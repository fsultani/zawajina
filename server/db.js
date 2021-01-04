const { MongoClient } = require("mongodb");

const uri = process.env.DEVELOPMENT
  ? "mongodb+srv://fsultani:asdf@my-match.rxspi.mongodb.net/my-match-dev?retryWrites=true&w=majority"
  : process.env.MONGODB_URI;

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
        db = client.db("my-match-dev");
        return callback(err);
      }
    );
  } else {
    return callback(null);
  }
};

const mongoDb = () => db;

const usersCollection = () => db.collection("users");

module.exports = {
  connectToServer,
  usersCollection,
};
