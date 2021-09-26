require('dotenv').config();
const { default: axios } = require('axios');
const { MongoClient } = require('mongodb');

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

    const postNewMessage = await axios.post(`http://localhost:3000/messages/api/new-message`, {
      conversationId: getConversation.data.conversationId,
      messageText: 'As-salāmu ʿalaykum.'
    },
    {
      headers: {
        Cookie: `my_match_authToken=${token}`
      }
    })

    console.log(`user: ${index + 1}`);
  })

  client.close();
})
