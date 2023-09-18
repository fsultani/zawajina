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
        db = client.db();
        return callback(err, db);
      }
    );
  } else {
    return callback(null);
  }
};

const geoLocationData = async (userIPAddress, lastActive = {}) => {
  let locationData;
  if (!userIPAddress) return locationData = { locationError: 'No location data available' };

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
    const userId = req.authUser?._id
    const now = new Date();

    const locationData = await geoLocationData(userIPAddress, authUser.lastActive);

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
      const userResponse = await usersCollection().findOneAndUpdate(
        { _id: ObjectId(userId) },
        {
          $set: {
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

      const user = userResponse.value;
      const endpointValue = endpoint.split('?')[0];
      const sessionHistory = [{
        email: user.email,
        endpoint: endpointValue,
        local: now.toLocaleString(),
        utc: now,
        ...locationData,
      }];

      if (endpointValue === '/api/auth-session/login') {
        logsUpdate = {
          sessionHistory: {
            '$each': [...sessionHistory],
            '$position': 0,
          },
        }
      } else if (endpointValue === '/api/register/profile-details' || endpointValue === '/api/password/reset') {
        logsUpdate = {
          sessionHistory: {
            '$each': [...sessionHistory],
            '$position': 0,
          },
          updatedFields: {
            '$each': updatedFields,
            '$position': 0,
          }
        }
      } else if (endpointValue === '/api/auth-session/logout' || endpointValue === '/api/expired-session/logout') {
        sessionHistory[0].endpoint = endpointValue;

        logsUpdate = {
          sessionHistory: {
            '$each': [...sessionHistory],
            '$position': 0,
          },
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
  } catch (error) {
    console.log(`error - server/db.js:183\n`, error);
    return error;
  }
}

const logsCollection = () => db.collection('logs');
const messagesCollection = () => db.collection('messages');
const usersCollection = () => db.collection('users');

module.exports = {
  connectToServer,
  db,
  geoLocationData,
  insertLogs,
  logsCollection,
  messagesCollection,
  usersCollection,
};
