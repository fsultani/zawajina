require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

// MongoClient.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }, async (client) => {
//   try {
//     const db = client.db();
  
//     const allUsers = await db.collection('users')
//       .find({ gender: 'female' })
//       .sort({ lastLogin: -1 })
//       .toArray();
  
//     allUsers.map(async (user) => {
//       const heightValueSplit = user.height.split('');
//       const heightLeftParenthesis = heightValueSplit.indexOf('(');
//       if (heightLeftParenthesis > -1) {
//         const userHeight = heightValueSplit.slice(heightLeftParenthesis + 1, -3).join('');
//         await db.collection('users').updateOne({ _id: user._id }, { $set: { height: userHeight.trim() }})
//         console.log(`done`);
//       }
//     })
  
//     client.close();
//   } catch (error) {
//     throw Error(error);
//   }
// })

async function run() {
  try {
    await client.connect();
    const database = client.db('my-match-dev');
    const usersCollection = database.collection('users');

    const filter = { email: 'ayleen@me.com' };
    const updateDocument = {
      $set: {
        city: 'Mount Shasta',
        state: 'CA',
        country: 'USA',
      }
    }

    const result = await usersCollection.updateMany(filter, updateDocument);
    console.log(`Updated ${result.modifiedCount} documents`);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
