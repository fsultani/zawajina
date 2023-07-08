/*
node server/queries/apiCalls/messages.js
*/

require('dotenv').config();
const axios = require('axios');

(async () => {
  try {
    const email = 'faridsultani.ba@gmail.com';
    const password = 'asdfasdf';

    const { data: login } = await axios.post('http://localhost:3000/api/auth-session/login', {
      email,
      password,
    })

    const token = login.cookie.value;
    console.log(`token - server/queries/apiCalls/messages.js:50\n`, token);

    const { data: users } = await axios.get('http://localhost:3000/users', {
      headers: {
        Cookie: `my_match_authToken=${token}`
      }
    })

    const usersHTMLResponse = users.replace(/\s/g, '');

    const userIDsArray = [...usersHTMLResponse.matchAll(/\/user\//g)]
    const userIDs = userIDsArray.map(item => {
      return usersHTMLResponse.slice(item.index + 6, item.index + 30)
    })

    const userNamesArray = [...usersHTMLResponse.matchAll(/testimonial-name/g)]
    const userNames = userNamesArray.map(item => {
      const stringToSearch = usersHTMLResponse.slice(item.index + 0, -1);
      const startingPoint = stringToSearch.search('testimonial-name') + 18;
      const endPoint = stringToSearch.search('location') - 23;
      const userName = stringToSearch.slice(startingPoint, endPoint);

      return userName;
    })

    const usersArray = [...Array(userIDs.length)].map((_, index) => ({
      userId: userIDs[index],
      userName: userNames[index]
    }))

    for (const userData of usersArray) {
      const { userId, userName } = userData;
      const index = usersArray.findIndex(item => item.userId === userId)

      const { data } = await axios.get(`http://localhost:3000/messages/api/conversation/user/${userId}`, {
        headers: {
          Cookie: `my_match_authToken=${token}`
        }
      })

      const conversationId = data.url.split('/')[2];

      await axios.post('http://localhost:3000/messages/api/new-message', {
        conversationId,
        messageText: `As-salāmu ʿalaykum, ${userName}.  This is message ${index}.`,
        otherUserId: userId,
      },
      {
        headers: {
          Cookie: `my_match_authToken=${token}`
        }
      })

      console.log(`${index + 1} of ${usersArray.length} messages sent`);
    }
  } catch (error) {
    const errorMessage = error.response?.data.message ?? error.message;
    console.log(`errorMessage - server/queries/apiCalls/messages.js:54\n`, errorMessage);
    process.exit(1);
  }
})();
