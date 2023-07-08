const axios = require('axios');
const { MongoClient, ObjectId } = require('mongodb');
const { getGeoCoordinates, getAllUnitedStates } = require('./data/world-cities').default;
const unitedStates = getAllUnitedStates();

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

const geoLocationData = async (userIPAddress, updates) => {
  let data = {};

  if (process.env.NODE_ENV === 'development') {
    const geoCoordinates = getGeoCoordinates();

    if (updates?.city) {
      let coordinatesData = geoCoordinates.find(item => item.city === updates?.city && item.state === updates?.state);

      if (!coordinatesData) {
        coordinatesData = geoCoordinates.find(item => item.state === updates?.state);
      }

      data = {
        status: 'success',
        country: 'United States',
        countryCode: 'US',
        region: updates?.state,
        regionName: unitedStates.find(item => item.abbreviation === updates?.state)?.name,
        city: updates?.city,
        zip: '92869',
        lon: coordinatesData.coordinates.longitude,
        lat: coordinatesData.coordinates.latitude,
        timezone: 'America/Los_Angeles',
        isp: 'Charter Communications',
        org: 'Spectrum',
        as: 'AS20001 Charter Communications Inc',
        query: '98.148.238.157'
      };
    }
  } else {
    data = await axios.get(`http://ip-api.com/json/${userIPAddress}`);
  }

  let locationData = data.status === 'success' ? data : { locationError: 'No location data available' };
  locationData = {
    ...locationData,
    userIPAddress: locationData.query,
  }

  delete locationData.query;

  return locationData;
}

const insertLogs = async (updates, userIPAddress, endpoint, userId = null) => {
  try {
    const locationData = await geoLocationData(userIPAddress, updates);
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
