require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const { MongoClient } = require('mongodb');

/*
  node server/queries/apiCalls/signup.js
*/

let db;
MongoClient.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, async (err, client) => {
  if (err) return err;

  if (process.env.NODE_ENV === 'development') {
    db = client.db();
    try {
      const existingAccounts = await db.collection('users').find({ name: { $regex: /farid/i } }).toArray();

      if (existingAccounts.length > 0) {
        console.log(`Delete all existing accounts first`);
        existingAccounts.forEach(async user => {
          await db.collection('users').deleteOne({ "_id": user._id })
          await db.collection('logs').deleteOne({ "_id": user._id })
        });
      }

      const data = {
        nameValue: 'Farid',
        email: 'faridsultani.ba@gmail.com',
        password: 'asdfasdf'
      }

      const headers = {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9,la;q=0.8',
        'cache-control': 'no-cache',
        'content-type': 'application/json;charset=UTF-8',
        'pragma': 'no-cache',
        'sec-ch-ua': '\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '\"macOS\"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'useripaddress': '98.148.238.157',
        'cookie': 'my_match_userId=63af89486ba130f8a229d528',
        'Referer': 'http://localhost:3000/signup',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }

      const signupResponse = await axios.post('http://localhost:3000/api/register/personal-info', data, { headers })
      console.log(`signupResponse.data - server/queries/apiCalls/signup.js:38\n`, signupResponse.data);
    } catch (error) {
      console.log(`error - server/queries/apiCalls/signup.js:55\n`, error);
      process.exit(1);
    } finally {
      client.close();
    }
  }
});
