/*
node server/queries/apiCalls/createFaridsAccount.js --numberOfPhotos=0
*/

require('dotenv').config();
const { MongoClient } = require('mongodb');
const cloudinary = require('cloudinary');
const fs = require('fs');

const axios = require('axios');
const FormData = require('form-data');

require('../../config/cloudinary');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const processArgv = process.argv.slice(2);

if (!processArgv[0]) {
  console.log('Missing arguments: --numberOfPhotos=0');
  console.log('Sample command: node server/queries/apiCalls/createFaridsAccount.js --numberOfPhotos=0');
  process.exit(1);
}

const firstArgument = processArgv[0]?.split('=')[0];

if (firstArgument !== '--numberOfPhotos') {
  console.log(`Missing arguments: --numberOfPhotos=0`);
  process.exit(1);
}

/* ************************* */

const numberOfPhotos = Number(processArgv[0].split('=')[1]);

(async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      await client.connect();
      const database = client.db('development');
      await database.command({ ping: 1 });
      console.log('Connected successfully to server');

      const usersQuery = { name: { $eq: 'Farid' } };
      const usersCollection = database.collection('users');
      const logsCollection = database.collection('logs');
      const messagesCollection = database.collection('messages');

      const existingDocumentCount = await usersCollection.countDocuments(usersQuery);
      console.log(`existingDocumentCount\n`, existingDocumentCount);

      if (existingDocumentCount > 0) {
        const usersCursor = await usersCollection.find(usersQuery).toArray();

        for (const userData of usersCursor) {
          const userId = userData._id;
          const userIdString = userData._id.toString();

          await cloudinary.v2.api.resources({ max_results: 10 }, async (resourcesError, resourcesResults) => {
            if (resourcesError) return resourcesError;
            if (resourcesResults.resources.length > 0) {
              resourcesResults.resources.filter(item => item.folder === userIdString).map(item => {
                console.log(`item - server/queries/apiCalls/deleteUser.js:48\n`, item);
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
                console.log(`folder - server/queries/apiCalls/deleteUser.js:61\n`, folder);
                cloudinary.v2.api.delete_folder(folder.name, function (error, result) {
                  if (error) return console.log('error:\n', error);
                  console.log(`result - server/queries/apiCalls/deleteUser.js:64\n`, result);
                });
              });
            }
          });

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

            const index = usersCursor.indexOf(userData);
            console.log(`${index + 1} of ${usersCursor.length} user accounts deleted`);
          }
        }
      }

      const email = 'faridsultani.ba@gmail.com';
      const password = 'asdfasdf';

      const signupStepOneResponse = await axios.post('http://localhost:3000/api/register/personal-info', {
        nameValue: 'Farid',
        email,
        password,
      })

      const { authUserId, emailVerificationToken } = signupStepOneResponse.data;

      await axios.put(`http://localhost:3000/api/register/verify-email`, {
        token: emailVerificationToken,
      },
        {
          headers: {
            Cookie: `my_match_userId=${authUserId}`
          }
        })

      const signupFormData = new FormData();

      signupFormData.append('userInfo', `{
        "birthMonth": "10",
        "birthDay": "14",
        "birthYear": "1983",
        "gender": "male",
        "city": "Orange",
        "state": "CA",
        "country": "United States",
        "ethnicity": [
          "Afghan"
        ],
        "countryRaisedIn": "United States",
        "languages": [
          "English"
        ],
        "religiousConviction": "Sunni",
        "religiousValues": "Conservative",
        "maritalStatus": "Never Married",
        "education": "Bachelor\'s degree",
        "profession": "Engineer",
        "hasChildren": "hasChildrenNo",
        "wantsChildren": "wantsChildrenMaybe",
        "height": 181,
        "canRelocate": "canRelocateNo",
        "diet": "Halal when possible",
        "smokes": "smokesNo",
        "prayerLevel": "Always",
        "hobbies": [
          "Coding"
        ],
        "aboutMe": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        "aboutMyMatch": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        "userIPAddress": "98.148.238.157"
      }`);

      for (let index = 0; index < numberOfPhotos; index++) {
        signupFormData.append(`image-${index}`, fs.createReadStream('/Users/farid/Downloads/temp/IMG_0041_800x800.jpg'));
      }

      signupFormData.append('authUserId', authUserId);

      const signupStepTwoResponse = await axios.post('http://localhost:3000/api/register/profile-details', signupFormData, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9,la;q=0.8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json;charset=UTF-8',
          'DNT': '1',
          'Origin': 'http://localhost:3000',
          'Pragma': 'no-cache',
          'Referer': 'http://localhost:3000/signup',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
          'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'userIPAddress': '98.148.238.157',
          ...signupFormData.getHeaders(),
        },
      })

      const { data } = await axios.post('http://localhost:3000/api/auth-session/login', {
        email,
        password,
      })

      const token = data.cookie.value;

      await axios.put('http://localhost:3000/search/api', {
        "locations": [],
        "languages": [],
        "profession": [],
        "hobbies": [],
        "maritalStatus": [],
        "religiousConviction": [],
        "religiousValues": [],
        "education": [],
        "hasChildren": "hasChildrenDoesNotMatter",
        "wantsChildren": "wantsChildrenDoesNotMatter",
        "hijab": "hijabDoesNotMatter",
        "canRelocate": "canRelocateDoesNotMatter",
        "smokes": "smokesDoesNotMatter",
        "ethnicity": [],
        "diet": [],
        "age": {
          "minAgeValue": "18",
          "maxAgeValue": "60"
        },
        "height": {
          "minHeightValue": "147",
          "maxHeightValue": "196"
        },
        "prayerLevel": [],
        "sortResults": "lastActive",
        "showPhotosOnly": false
      },
        {
          headers: {
            Cookie: `my_match_authToken=${token}`
          }
        })

      console.log(`signupStepTwoResponse.data - server/queries/apiCalls/create-farids-account.js:169\n`, signupStepTwoResponse.data);
    } catch (error) {
      const errorMessage = error.response?.data.message ?? error.message;
      console.log(`errorMessage - server/queries/apiCalls/create-farids-account.js:241\n`, errorMessage);
      process.exit(1);
    } finally {
      await client.close();
      console.log(`Close client`);
    }
  }
})();
