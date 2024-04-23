const axios = require('axios');
const { MongoClient, ObjectId } = require('mongodb');

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
        db = client.db(process.env.NODE_ENV);
        return callback(err, db);
      }
    );
  } else {
    return callback(null);
  }
};

const logsCollection = () => db.collection('logs');
const messagesCollection = () => db.collection('messages');
const usersCollection = () => db.collection('users');

const geoLocationData = async (userIPAddress, lastActive) => {
  let locationData;
  if (!userIPAddress  && process.env.NODE_ENV !== 'development') return locationData = { locationError: 'No location data available' };

  const existingIP = lastActive?.userIPAddress;

  let userIPData = {};

  if (process.env.NODE_ENV === 'development') {
    userIPData = {
      data: {
        status: 'success',
        country: 'United States',
        countryCode: 'US',
        region: 'CA',
        regionName: 'California',
        city: 'Orange',
        zip: '92868',
        lat: 33.7871,
        lon: -117.8821,
        timezone: 'America/Los_Angeles',
        isp: 'Charter Communications',
        org: 'Spectrum',
        as: 'AS20001 Charter Communications Inc',
        query: '98.148.238.157'
      }
    };
  } else if (existingIP && existingIP === userIPAddress) {
    userIPData = {
      data: {
        ...lastActive,
      }
    }
  } else {
    userIPData = await axios.get(`http://ip-api.com/json/${userIPAddress}`);
  }

  locationData = userIPData.data.status === 'success' ? userIPData.data : { locationError: 'No location data available' };
  locationData = {
    ...locationData,
    userIPAddress: locationData.query,
  }

  delete locationData.query;

  return locationData;
}

const insertLogs = async (req, updates) => {
  try {
    const { checkIPAddress } = require('./middleware/checkAuthentication');
    const { userIPAddress } = await checkIPAddress(req);
    const endpoint = req.originalUrl;

    const authUser = req.authUser;
    const lastActive = authUser?.lastActive ?? {};
    const authUserId = req.authUser?._id
    const now = new Date();

    const locationData = await geoLocationData(userIPAddress, lastActive);

    await usersCollection().findOneAndUpdate(
      { _id: ObjectId(authUserId) },
      {
        $set: {
          /* 
            This is necessary because of the way the "$near" query works in MongoDB.
            The "lon" and "lat" values must be in one array, and be directly on the document (not nested).
          */
          geolocationCoordinates: [locationData.lon, locationData.lat],
          lastActive: {
            endpoint,
            local: now.toLocaleString(),
            utc: now,
            ...locationData,
          }
        },
      },
      {
        returnDocument: 'after',
        returnNewDocument: true,
      }
    )

    const logs = {
      '$each': [{
        endpoint,
        email: authUser.email,
        updates: Object.keys(updates).length > 0 ? { ...updates } : null,
        updatedAt: {
          local: now.toLocaleString(),
          utc: now,
          ...locationData,
        },
      }],
      '$position': 0,
    };

    await logsCollection().findOneAndUpdate(
      { _id: ObjectId(authUserId) },
      {
        $push: {
          logs,
        }
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.log(`error - server/db.js:137\n`, error);
    return error;
  }
}

module.exports = {
  connectToServer,
  logsCollection,
  messagesCollection,
  usersCollection,
  geoLocationData,
  insertLogs,
};
