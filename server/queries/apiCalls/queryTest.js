require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

async function run() {
  try {
    await client.connect();
    const database = client.db('my-match-dev');
    const usersCollection = database.collection('users');

    const query = {
      location:
      {
        $near:
        {
          $geometry: { type: "Point", coordinates: [-73.9667, 40.78] },
          $minDistance: 1000,
          $maxDistance: 5000
        }
      }
    };
    const options = {};
    const cursor = usersCollection.find(query, options);

    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
    }

    await cursor.forEach(document => {
      console.log(`document\n`, document);
    });
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
