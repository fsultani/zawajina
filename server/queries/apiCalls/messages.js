require('dotenv').config();
const { default: axios } = require('axios');
const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, async (err, client) => {
  const db = client.db();

  const login = await axios.post('http://localhost:3000/login', {
    email: 'farid@me.com',
    password: 'asdfasdf'
  })
  const { token } = login.data;

  const allUsers = await db.collection('users')
    .find({ gender: 'female' })
    .sort({ lastLogin: -1 })
    .toArray();

  allUsers.map(async (user, index) => {
    const getConversation = await axios.get(`http://localhost:3000/messages/api/conversation/user/${user._id}`, {
      headers: {
        Cookie: `my_match_authToken=${token}`
      }
    })

    await axios.post(`http://localhost:3000/messages/api/new-message`, {
      conversationId: getConversation.data.conversationId,
      messageText: `As-salāmu ʿalaykum, ${user.name}.  This is message #${index}.`
    },
    {
      headers: {
        Cookie: `my_match_authToken=${token}`
      }
    })
  })

  client.close();
})

// MongoClient.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }, async (err, client) => {
//   const db = client.db();

//   const allMaleUsers = await db.collection('users')
//     .find({ gender: 'male' })
//     .sort({ lastLogin: -1 })
//     .toArray();

//   const allFemaleUsers = await db.collection('users')
//     .find({ gender: 'female' })
//     .sort({ lastLogin: -1 })
//     .toArray();

//   const allConversations = await db.collection('messages').find().toArray();

//   if (allConversations.length > 0) {
//     allConversations.map(async (conversation, conversationIndex) => {
//       const now = new Date();
//       const messageDate = now.toLocaleDateString();
//       const message = {
//         $set: { updatedAt: new Date() },
//         $push: {
//           messages: {
//             sender: conversation.recipientId,
//             recipient: conversation.createdByUserId,
//             messageText: `As-salāmu ʿalaykum, ${conversation.users.createdByUser.name}.  My name is ${conversation.users.recipient.name}. This is message #${conversationIndex + 1}.`,
//             messageDate,
//             read: false,
//           }
//         }
//       }

//       await db.collection('messages').updateOne({ _id: conversation._id }, message);

//       if (conversationIndex === allConversations.length - 1) {
//         console.log(`done`);
//         client.close();
//       }
//     })
//   } else {
//     allMaleUsers.map(async (maleUser, maleUserIndex) => {
//       allFemaleUsers.map(async (femaleUser, femaleUserIndex) => {
//         const conversation = {
//           createdAt: new Date(),
//           updatedAt: new Date(),
//           createdByUserId: maleUser._id,
//           recipientId: femaleUser._id,
//           users: {
//             createdByUser: maleUser,
//             recipient: femaleUser,
//           },
//           messages: [],
//         }

//         /* Create the new conversation in.  Send the ID. */
//         const { insertedId } = await db.collection('messages').insertOne(conversation);

//         let conversationsCollection = await db.collection('messages').findOne({ _id: ObjectId(insertedId) })
//         const now = new Date();
//         const messageDate = now.toLocaleDateString();
//         const message = {
//           $set: { updatedAt: new Date() },
//           $push: {
//             messages: {
//               sender: maleUser._id,
//               recipient: String(maleUser._id) === String(conversationsCollection.recipientId) ? conversationsCollection.createdByUserId : conversationsCollection.recipientId,
//               messageText: `As-salāmu ʿalaykum, ${femaleUser.name}.  My name is ${maleUser.name}. This is message #${femaleUserIndex + 1}.`,
//               messageDate,
//               read: false,
//             }
//           }
//         }

//         await db.collection('messages').updateOne({ _id: conversationsCollection._id }, message);

//         const allFemaleUsersDone = femaleUserIndex === allFemaleUsers.length - 2;
//         const allMaleUsersDone = maleUserIndex === allMaleUsers.length - 1;

//         if (allFemaleUsersDone && allMaleUsersDone) {
//           console.log(`done`);
//           client.close();
//         }
//       })
//     })
//   }
// });
