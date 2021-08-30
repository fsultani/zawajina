const express = require('express');
const { ObjectId, ObjectID } = require('mongodb');

const router = express.Router();

const { usersCollection, messagesCollection, messagesAggregate } = require('../db');

router.get('/:conversationId?', async (req, res, next) => {
  const { conversationId } = req.params;
  const { authUser, allConversationsCount } = req;

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
      allConversationsCount,
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
    // const allConversationsSidebar = await messagesCollection().aggregate([
    //   {
    //     $match: {
    //       $or: [
    //         {
    //           recipientId: ObjectId(authUser._id),
    //         },
    //         {
    //           createdByUserId: ObjectId(authUser._id)
    //         }
    //       ]
    //     }
    //   },
    //   {
    //     $addFields: {
    //       'otherUser': {
    //         $cond: {
    //           'if': {
    //             $eq: ['$recipientId', ObjectId(authUser._id)]
    //           },
    //           'then': '$users.createdByUser.name',
    //           'else': '$users.recipient.name',
    //         }
    //       },
    //       'lastMessagePreview': {
    //         $substrBytes: [{ '$last': '$messages.messageText' }, 0, 50]
    //       },
    //       'lastMessageWasRead': {
    //         $cond: {
    //           'if': {
    //             $eq: [{ '$last': '$messages.recipient' }, ObjectId(authUser._id)]
    //           },
    //           'then': { '$last': '$messages.read' },
    //           'else': true,
    //         }
    //       },
    //       'unreadMessagesCount': {
    //         $sum: {
    //           $map: {
    //             'input': '$messages',
    //             'as': 'message',
    //             'in': {
    //               $cond: {
    //                 'if': {
    //                   $and: [
    //                     { $eq: [ '$$message.recipient', ObjectId(authUser._id) ] },
    //                     { $eq: [ '$$message.read', false ] },
    //                   ]
    //                 },
    //                 'then': 1,
    //                 'else': 0,
    //               }
    //             }
    //           }
    //         }
    //       },
    //     }
    //   },
    //   {
    //     $project: {
    //       otherUser: 1,
    //       lastMessagePreview: 1,
    //       lastMessageWasRead: 1,
    //       unreadMessagesCount: 1,
    //     }
    //   }
    // ]).toArray();

    // res.status(200).json({
    //   allConversationsSidebar,
    // });

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

      let lastMessage = {}
      if (conversation.messages.length > 0) {
        const lastMessageObject = conversation.messages[conversation.messages.length - 1];
        lastMessage = {
          preview: lastMessageObject.messageText.slice(0, 50),
          wasRead: String(lastMessageObject.sender) === authUserId ? true : lastMessageObject.read,
        }
      } else {
        lastMessage = {
          preview: '',
          wasRead: true,
        }
      }

      const unreadMessagesCount = conversation.messages.filter(message => {
        if (String(message.sender) !== authUserId) {
          return !message.read;
        }
      }).length;

      allConversations.push({
        ...conversation,
        otherUser,
        lastMessagePreview: lastMessage.preview,
        lastMessageWasRead: lastMessage.wasRead,
        unreadMessagesCount,
      })
    });

    res.status(200).json({
      allConversationsSidebar: allConversations,
    });
  } catch (error) {
    console.log(`Error in /api/conversations\n`, error);
    throw new Error(error);
  }
})

/****************************************************************************************************
// View the conversation with a user through the user's profile page
****************************************************************************************************/

router.get('/api/conversation/user/:userId', async (req, res, next) => {
  const { authUser } = req;
  const recipientId = req.params.userId;

  try {
    /* Conversation was accessed by clicking on the message button from the user's profile */
    const conversationsCollection = await messagesCollection().findOne({
      $or: [
        {
          $and: [
            { recipientId: ObjectId(authUser._id) },
            { createdByUserId: ObjectId(recipientId) }
          ]
        },
        {
          $and: [
            { recipientId: ObjectId(recipientId) },
            { createdByUserId: ObjectId(authUser._id) }
          ]
        },
      ]
    })
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
// Get the conversation with a user after the conversation page loads
****************************************************************************************************/

router.get('/api/conversation/:conversationId', async (req, res, next) => {
  const { authUser } = req;
  const conversationId = req.params.conversationId;

  try {
    /* Conversation was accessed by clicking on the message button from the user's profile */
    const conversationsCollection = await messagesCollection().findOne({ _id: ObjectId(conversationId) })
    await messagesCollection().updateOne(
      {
        _id: ObjectId(conversationId),
      },
      { $set: { "messages.$[element].read": true } },
      {
        multi: true,
        arrayFilters: [
          {
            "element.recipient": ObjectId(authUser._id),
          }
        ]
      }
    )
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

  let conversationsCollection = await messagesCollection().findOne({ _id: ObjectId(conversationId) })
  try {
    const now = new Date();
    const date = now.toLocaleDateString()
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timeStamp = `${date} - ${time}`;
    const message = {
      $set: { updatedAt: new Date() },
      $push: {
        messages: {
          sender: authUser._id,
          recipient: String(authUser._id) === String(conversationsCollection.recipientId) ? conversationsCollection.createdByUserId : conversationsCollection.recipientId,
          messageText,
          timeStamp,
          read: false,
        }
      }
    }

    await messagesCollection().updateOne({ _id: conversationsCollection._id }, message);
    conversationsCollection = await messagesCollection().findOne({ _id: ObjectId(conversationId) })

    res.status(200).json({
      createdByUser: conversationsCollection.users.createdByUser,
      authUser,
      message: messageText,
      timeStamp,
    });
  } catch (error) {
    console.log(`Error in /api/new-message\n`, error);
    throw new Error(error);
  }
})

module.exports = router;
