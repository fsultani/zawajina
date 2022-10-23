const { MongoClient, ObjectId } = require('mongodb');
const { FetchData, sleep } = require('./utils');

let db;
const connectToServer = callback => {
  if (!db) {
    console.log(`process.env.MONGODB_URI\n`, process.env.MONGODB_URI);
    MongoClient.connect(
      process.env.MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err, client) => {
        console.log(`err\n`, err);
        console.log(`client\n`, client);
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
const logsCollection = () => db.collection('logs');

let numberOfTries = 0;
const geoLocationData = async userIPAddress => {
  let data = await FetchData(`http://ip-api.com/json/${userIPAddress}`);

  if (data.status !== 'success' && numberOfTries < 3) {
    numberOfTries += 1;
    await sleep(3000);
    return await geoLocationData(userIPAddress);
  }

  return data;
}

const insertLogs = async (updates, userIPAddress, endpoint, userId = null) => {
  const locationData = await geoLocationData(userIPAddress);
  const now = new Date();

  const newEntry = {
    _id: updates._id,
  };

  delete updates._id;

  const updatedFields = [{
    ...updates,
    endpoint,
    updatedAt: {
      local: now.toLocaleString(),
      utc: now,
      ...locationData,
    }
  }];

  let logsUpdate = {
    ...updatedFields,
  }

  if (userId) {
    const user = await usersCollection().findOne({ _id: ObjectId(userId) });
    const loginHistory = [{
      email: user.email,
      local: now.toLocaleString(),
      utc: now,
      ...locationData,
    }];

    if (endpoint === '/login') {
      logsUpdate = {
        loginHistory: {
          '$each': [...loginHistory],
          '$position': 0,
        },
      }
    } else if (endpoint == '/register/api/profile-details' || endpoint === '/password/api/reset') {
      logsUpdate = {
        loginHistory: {
          '$each': [...loginHistory],
          '$position': 0,
        },
        updatedFields: {
          '$each': updatedFields,
          '$position': 0,
        }
      }
    } else {
      logsUpdate = {
        updatedFields: {
          '$each': updatedFields,
          '$position': 0,
        }
      }
    }

    await logsCollection().findOneAndUpdate(
      { _id: user._id },
      {
        $push: {
          ...logsUpdate,
        }
      },
    );
  } else {
    newEntry.updatedFields = [...updatedFields];
    await logsCollection().insertOne(newEntry);
  }
}

module.exports = {
  connectToServer,
  db,
  messagesCollection,
  insertLogs,
  usersCollection,
};
