require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

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
  } catch (error) {
    console.log(`error - server/queries/apiCalls/modifyField.js:23\n`, error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
