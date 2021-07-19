const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

const { usersCollection, messagesCollection } = require('../db');

router.get('/:conversationId?', async (req, res, next) => {
  const { conversationId } = req.params;
  const { authUser, conversationsCount } = req;

  const conversationsCollection = await messagesCollection().findOne({ _id: ObjectId(conversationId) })
  const users = conversationsCollection ? conversationsCollection.users : {};

  res.render('app/_layouts/index', {
    locals: {
      title: 'My Match',
      styles: [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css',
        '/static/client/views/app/_partials/app-nav.css',
        '/static/client/views/app/_layouts/app-global-styles.css',
        '/static/client/views/app/messages/styles.css',
      ],
      scripts: [
        'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
        'https://cdn.jsdelivr.net/npm/js-cookie@beta/dist/js.cookie.min.js',
        '/static/client/views/app/messages/script.js',
      ],
      authUser,
      conversationsCount,
      conversationId,
      users,
    },
    partials: {
      nav: 'app/_partials/app-nav',
      body: 'app/messages/index',
    },
  });
});

/****************************************************************************************************
// Get all conversations
****************************************************************************************************/

router.get('/api/conversations', async (req, res, next) => {
  const { authUser } = req;

  try {
    const allConversations = [];
    await messagesCollection().find({
      $or: [
        {
          recipientId: ObjectId(authUser._id),
        },
        {
          createdByUserId: ObjectId(authUser._id)
        }
      ]
    }).forEach(conversation => {
      let otherUser = conversation.users.recipient.name;

      const authUserId = String(authUser._id);
      const otherUserId = String(conversation.users.recipient._id);
      if (authUserId === otherUserId) {
        otherUser = conversation.users.createdByUser.name;
      }

      const lastMessagePreview = conversation.messages[conversation.messages.length - 1];
      const lastMessageWasRead = String(lastMessagePreview.sender) === authUserId ? true : lastMessagePreview.read;
      const allUnreadMessagesCount = conversation.messages.filter(message => !message.read).length;

      allConversations.push({
        ...conversation,
        otherUser,
        lastMessagePreview: lastMessagePreview.messageText.slice(0, 100),
        lastMessageWasRead,
        allUnreadMessagesCount,
      })
    });

    res.status(200).json({
      allConversations,
    });
  } catch (error) {
    console.log(`Error in /api/conversations\n`, error);
    throw new Error(error);
  }
})

/****************************************************************************************************
// View the conversation with a user
****************************************************************************************************/

router.get('/api/conversation/user/:userId', async (req, res, next) => {
  const { authUser } = req;
  const recipientId = req.params.userId;

  try {
    /* Conversation was accessed by clicking on the message button from the user's profile */
    const conversationsCollection = await messagesCollection().findOne({ $or: [{ recipientId: ObjectId(recipientId) }, { createdByUserId: ObjectId(recipientId) }] })
    const recipient = await usersCollection().findOne({ _id: ObjectId(recipientId) });

    /* No conversation exists.  Create a new one. */
    if (!conversationsCollection) {
      const conversation = {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdByUserId: authUser._id,
        recipientId: recipient._id,
        users: {
          createdByUser: authUser,
          recipient,
        },
        messages: [],
      }

      /* Create the new conversation in.  Send the ID. */
      const newConversation = await messagesCollection().insertOne(conversation);
      res.status(201).json({ conversationId: newConversation.insertedId });
    } else {
      /* A conversation exists.  Send the ID. */
      return res.status(200).json({ conversationId: conversationsCollection._id });
    }
  } catch (error) {
    console.log(`Error in /api/conversation/user/:userId\n`, error);
    throw new Error(error);
  }
})

/****************************************************************************************************
// View the conversation with a user
****************************************************************************************************/

router.get('/api/conversation/:conversationId', async (req, res, next) => {
  const { authUser } = req;
  const conversationId = req.params.conversationId;

  try {
    /* Conversation was accessed by clicking on the message button from the user's profile */
    const conversationsCollection = await messagesCollection().findOne({ _id: ObjectId(conversationId) })
    const messages = conversationsCollection && conversationsCollection.messages.length > 0 ? conversationsCollection.messages : [];

    res.status(200).json({
      conversationId: conversationsCollection._id,
      createdByUser: conversationsCollection.users.createdByUser,
      authUser,
      messages,
    });
  } catch (error) {
    console.log(`Error in /api/conversation/:conversationId\n`, error);
    throw new Error(error);
  }
})

/****************************************************************************************************
// Send a new message to a user
****************************************************************************************************/

router.post('/api/new-message', async (req, res) => {
  const { authUser } = req;
  const { conversationId, messageText } = req.body;

  try {
    const now = new Date();
    const time = now.toLocaleTimeString()
    const conversation = {
      $set: { updatedAt: new Date() },
      $push: {
        messages: {
          sender: authUser._id,
          messageText,
          time,
          read: false,
        }
      }
    }

    let conversationsCollection = await messagesCollection().findOne({ _id: ObjectId(conversationId) })
    await messagesCollection().updateOne({ _id: conversationsCollection._id }, conversation);
    conversationsCollection = await messagesCollection().findOne({ _id: ObjectId(conversationId) })
    const messages = conversationsCollection && conversationsCollection.messages.length > 0 ? conversationsCollection.messages : [];

    res.status(200).json({
      createdByUser: conversationsCollection.users.createdByUser,
      authUser,
      messages,
    });
  } catch (error) {
    console.log(`Error in /api/new-message\n`, error);
    throw new Error(error);
  }
})

module.exports = router;
