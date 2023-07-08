require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const { MongoClient } = require('mongodb');

/*
  node server/queries/apiCalls/signupProfile.js
*/

let db;
MongoClient.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, async (err, client) => {
  if (err) return err;

  db = client.db();
  const signupFormData = new FormData();

  try {
    const existingAccounts = await db.collection('users').find({ name: { $regex: /farid/i } }).toArray();

    if (existingAccounts.length > 0) {
      console.log(`Delete all existing accounts first`);
      existingAccounts.forEach(async user => {
        await db.collection('users').deleteOne({ "_id": user._id })
        await db.collection('logs').deleteOne({ "_id": user._id })
      });
    }

    const signupStepOneResponse = await axios.post('http://localhost:3000/api/register/personal-info', {
      nameValue: "Farid",
      email: "faridsultani.ba@gmail.com",
      password: "asdfasdf"
    })

    const { userId } = signupStepOneResponse.data;

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
        "hasChildren": "No",
        "wantsChildren": "No",
        "height": 181,
        "canRelocate": "No",
        "diet": "Halal when possible",
        "smokes": "No",
        "hobbies": [
          "Coding"
        ],
        "aboutMe": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        "aboutMyMatch": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        "userIPAddress": "98.148.238.157"
      }`);

    signupFormData.append('userId', userId);

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

    console.log(`signupStepTwoResponse.data - server/queries/apiCalls/signupProfile.js:79\n`, signupStepTwoResponse.data);
  } catch (error) {
    console.log(`error - server/queries/apiCalls/signupProfile.js:99\n`, error);
    process.exit(1);
  } finally {
    client.close();
  }
});
