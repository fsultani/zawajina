/*
node server/queries/apiCalls/addBlockedUsers.js --limit=0 --unblockAll=false
*/

require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const processArgv = process.argv.slice(2);

if (!processArgv[0] || !processArgv[1]) {
  console.log(`Missing arguments: --limit=0 --unblockAll=false`);
  process.exit(1);
}

const firstArgument = processArgv[0]?.split('=')[0];
const secondArgument = processArgv[1]?.split('=')[0];

if (
  !(
    (firstArgument === '--limit' || firstArgument === '--unblockAll') &&
    (secondArgument === '--limit' || secondArgument === '--unblockAll')
  )
) {
  console.log(`Missing arguments: --limit=0 --unblockAll=false`);
  process.exit(1);
}

/* ************************* */

let limit;
if (firstArgument === '--limit') {
  limit = Number(processArgv[0].split('=')[1]);
}

if (secondArgument === '--limit') {
  limit = Number(processArgv[1].split('=')[1]);
}

if (limit !== 0 && !limit) {
  console.log(`Enter a number for limit`);
  process.exit(1);
}

let unblockAll;
if (firstArgument === '--unblockAll') {
  unblockAll = processArgv[0].split('=')[1];
}

if (secondArgument === '--unblockAll') {
  unblockAll = processArgv[1].split('=')[1];
}

if (!unblockAll) {
  console.log(`unblockAll must be true or false`);
  process.exit(1);
}

let numberOfUsersBlocked = 0;
let numberOfUsersUnblocked = 0;

const addBlockedUsers = async (userFaridDocumentId, userId) => {
  try {
    const userIsBlocked = !!await usersCollection.findOne({
      _id: ObjectId(userFaridDocumentId),
      blockedUsers: {
        $in: [ObjectId(userId)]
      }
    });

    if (!userIsBlocked) {
      await usersCollection.findOneAndUpdate({
        _id: ObjectId(userFaridDocumentId),
      }, {
        $push: {
          blockedUsers: ObjectId(userId),
        },
      });

      numberOfUsersBlocked += 1;
    }
  } catch (error) {
    const errorMessage = error.response?.data.message ?? error.message;
    console.log(`errorMessage - server/queries/apiCalls/addBlockedUsers.js:34\n`, errorMessage);
  }
}

const unblockAllUsers = async (userFaridDocumentId, userId) => {
  try {
    await usersCollection.findOneAndUpdate({
      _id: ObjectId(userFaridDocumentId),
    }, {
      $pull: {
        blockedUsers: ObjectId(userId),
      },
    });

    numberOfUsersUnblocked += 1;
  } catch (error) {
    const errorMessage = error.response?.data.message ?? error.message;
    console.log(`errorMessage - server/queries/apiCalls/addBlockedUsers.js:34\n`, errorMessage);
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
    const allUsers = await usersCollection.find(allUsersQuery).project({ _id: 1 }).toArray();

    const userFarid = { name: { $eq: 'Farid' } };
    const userFaridDocument = await usersCollection.findOne(userFarid);
    const userFaridDocumentId = userFaridDocument._id;

    if (unblockAll === 'true') {
      for (const user of allUsers) {
        const userId = user._id;
        await unblockAllUsers(userFaridDocumentId, userId);

        const index = allUsers.indexOf(user);
        console.log(`${index + 1}/${limit} users processed`);
      }
    } else {
      if (limit > 0) {
        allUsers = await usersCollection.find(allUsersQuery).project({ _id: 1 }).limit(limit).toArray();
      }

      limit = allUsers.length;

      for (const user of allUsers) {
        const userId = user._id;
        await addBlockedUsers(userFaridDocumentId, userId);

        const index = allUsers.indexOf(user);
        console.log(`${index + 1}/${limit} users processed`);
      }
    }

    console.log(`\n**********`);

    console.log(`${numberOfUsersBlocked} users blocked`);
    console.log(`${numberOfUsersUnblocked} users unblocked`);

    await client.close();
    console.log(`Close client`);
  }
})();
