/*
node server/queries/apiCalls/addLikedByUsers.js --limit=0
*/

require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const processArgv = process.argv.slice(2);

if (!processArgv[0]) {
  console.log(`Missing arguments: --limit=-1`);
  process.exit(1);
}

const limitValue = processArgv[0]?.split('=')[1];
let limit = Number(limitValue);

const addLikedByUsers = async (userFaridDocumentId, userId) => {
  try {
    await usersCollection.findOneAndUpdate({
      _id: ObjectId(userFaridDocumentId),
    }, {
      $push: {
        likedByUsers: ObjectId(userId),
      },
    });

    await usersCollection.findOneAndUpdate({
      _id: ObjectId(userId),
    }, {
      $push: {
        usersLiked: ObjectId(userFaridDocumentId),
      },
    });
  } catch (error) {
    const errorMessage = error.response?.data.message ?? error.message;
    console.log(`errorMessage - server/queries/apiCalls/addLikedByUsers.js:42\n`, errorMessage);
  }
}

(async () => {
  if (process.env.NODE_ENV === 'development') {
    await client.connect();
    const database = client.db('development');
    await database.command({ ping: 1 });
    console.log('Connected successfully to server');

    usersCollection = database.collection('users');
    const allUsersQuery = { name: { $ne: 'Farid' } };
    let allUsers = await usersCollection.find(allUsersQuery).project({ _id: 1 }).toArray();

    if (limit > 0) {
      allUsers = await usersCollection.find(allUsersQuery).project({ _id: 1 }).limit(limit).toArray();
    }

    const numberOfUsers = allUsers.length;

    const userFarid = { name: { $eq: 'Farid' } };
    const userFaridDocument = await usersCollection.findOne(userFarid);
    const userFaridDocumentId = userFaridDocument._id;

    for (const user of allUsers) {
      const userId = user._id;
      await addLikedByUsers(userFaridDocumentId, userId);

      const index = allUsers.indexOf(user);
      console.log(`${index + 1}/${numberOfUsers} users liked by authUser`);
    }

    await client.close();
    console.log(`Close client`);
  }
})();
