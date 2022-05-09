const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

const { getAllFiles } = require('../utils');
const { usersCollection, messagesCollection } = require('../db');

const {
  emailBodyContainerStyles,
  emailHeader,
  paragraphStyles,
  ctaButton,
  emailSignature,
} = require('../email-templates/components');

const sendEmail = require('../helpers/email');

router.get('/:conversationId?', async (req, res) => {
  const { conversationId } = req.params;
  const { authUser, allConversationsCount } = req;

  const conversationsCollection = await messagesCollection().findOne({ _id: ObjectId(conversationId) })
  const users = conversationsCollection ? conversationsCollection.users : {};

  const directoryPath = ['client/views/app/messages'];

  const styles = [
    '/static/assets/styles/fontawesome-free-5.15.4-web/css/all.css',
    '/static/client/views/app/_partials/app-nav.css',
    '/static/client/views/app/_layouts/app-global-styles.css',
  ];

  const scripts = [
    '/static/assets/apis/axios.min.js',
    '/static/assets/apis/js.cookie.min.js',
  ]

  res.render('app/_layouts/index', {
    locals: {
      title: 'My Match',
      styles: getAllFiles({ directoryPath, fileType: 'css', filesArray: styles }),
      scripts: getAllFiles({ directoryPath, fileType: 'js', filesArray: scripts }),
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

/* ************************************************** */
/*
  Get all conversations using find().
  This is needed when using the local db
*/

// router.get('/api/conversations1', async (req, res) => {
//   const { authUser, allConversationsCount } = req;

//   try {
//     const allConversations = [];
//     await messagesCollection().find({
//       $or: [
//         {
//           recipientId: ObjectId(authUser._id),
//         },
//         {
//           createdByUserId: ObjectId(authUser._id)
//         }
//       ]
//     }).forEach(conversation => {
//       let otherUser = conversation.users.recipient.name;

//       const authUserId = String(authUser._id);
//       const otherUserId = String(conversation.users.recipient._id);
//       if (authUserId === otherUserId) {
//         otherUser = conversation.users.createdByUser.name;
//       }

//       let lastMessage = {}
//       if (conversation.messages.length > 0) {
//         const lastMessageObject = conversation.messages[conversation.messages.length - 1];
//         lastMessage = {
//           preview: lastMessageObject.messageText.slice(0, 50),
//           wasRead: String(lastMessageObject.sender) === authUserId ? true : lastMessageObject.read,
//         }
//       } else {
//         lastMessage = {
//           preview: '',
//           wasRead: true,
//         }
//       }

//       const unreadMessagesCount = conversation.messages.filter(message => {
//         if (String(message.sender) !== authUserId) {
//           return !message.read;
//         }
//       }).length;

//       allConversations.push({
//         _id: conversation._id,
//         otherUser,
//         lastMessagePreview: lastMessage.preview,
//         lastMessageWasRead: lastMessage.wasRead,
//         unreadMessagesCount,
//       })
//     });
//     allConversations.sort((a, b) => b.updatedAt - a.updatedAt)

//     res.status(200).json({
//       allConversationsCount,
//       allConversationsSidebar: allConversations,
//       hasMoreConversations: allConversations.length > 0,
//     });
//   } catch (error) {
//     console.log(`Error in /api/conversations\n`, error);
//     throw new Error(error);
//   }
// })

/* ************************************************** */
/*
  Get all conversations using aggregate()
*/

router.get('/api/conversations', async (req, res) => {
  const { authUser, allConversationsCount } = req;
  const { page } = req.query;
  const limit = 25;
  const skipRecords = page > 1 ? (page - 1) * limit : 0;

  try {
    const allConversationsSidebar = await messagesCollection().aggregate([
      {
        $match: {
          $or: [
            {
              recipientId: ObjectId(authUser._id),
            },
            {
              createdByUserId: ObjectId(authUser._id)
            }
          ]
        }
      },
      {
        $addFields: {
          otherUser: {
            $cond: {
              'if': {
                $eq: ['$recipientId', ObjectId(authUser._id)]
              },
              'then': '$users.createdByUser.name',
              'else': '$users.recipient.name',
            }
          },
          lastMessagePreview: {
            $substrBytes: [{ '$last': '$messages.messageText' }, 0, 50]
          },
          lastMessageWasRead: {
            $cond: {
              'if': {
                $eq: [{ '$last': '$messages.recipient' }, ObjectId(authUser._id)]
              },
              'then': { '$last': '$messages.read' },
              'else': true,
            }
          },
          unreadMessagesCount: {
            $sum: {
              $map: {
                'input': '$messages',
                'as': 'message',
                'in': {
                  $cond: {
                    'if': {
                      $and: [
                        { $eq: ['$$message.recipient', ObjectId(authUser._id)] },
                        { $eq: ['$$message.read', false] },
                      ]
                    },
                    'then': 1,
                    'else': 0,
                  }
                }
              }
            }
          },
        }
      },
      {
        $project: {
          updatedAt: 1,
          otherUser: 1,
          lastMessagePreview: 1,
          lastMessageWasRead: 1,
          unreadMessagesCount: 1,
        }
      }
    ])
      .sort({ updatedAt: -1 })
      .skip(skipRecords)
      .limit(limit)
      .toArray();

    res.status(200).json({
      allConversationsCount,
      allConversationsSidebar,
      hasMoreConversations: allConversationsSidebar.length > 0,
    });
  } catch (error) {
    console.log(`Error in /api/conversations\n`, error);
    new Error(error);
  }
})

/* ************************************************** */
/*
  Get messages search query
*/

router.get('/api/conversations/search', async (req, res) => {
  const { authUser } = req;
  const { searchQuery } = req.query;

  try {
    const searchQueryRegex = new RegExp(searchQuery, 'ig')
    const searchMessages = await messagesCollection().aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                {
                  recipientId: ObjectId(authUser._id),
                },
                {
                  createdByUserId: ObjectId(authUser._id)
                }
              ]
            },
            {
              $or: [
                {
                  'users.recipient.name': {
                    $regex: searchQueryRegex
                  }
                },
                {
                  'messages.messageText': {
                    $regex: searchQueryRegex
                  }
                },
              ]
            }
          ]
        },
      },
      {
        $addFields: {
          recipientName: {
            $regexMatch: {
              input: '$users.recipient.name',
              regex: searchQueryRegex
            }
          },
          message: {
            $last: {
              $filter: {
                input: '$messages.messageText',
                as: 'message',
                cond: {
                  $regexMatch: {
                    input: '$$message',
                    regex: searchQueryRegex
                  }
                }
              },
            }
          },
          username: {
            $cond: {
              'if': {
                $eq: ['$recipientId', ObjectId(authUser._id)]
              },
              'then': '$users.createdByUser.name',
              'else': '$users.recipient.name',
            }
          },
          lastMessageWasRead: {
            $cond: {
              'if': {
                $eq: [{ '$last': '$messages.recipient' }, ObjectId(authUser._id)]
              },
              'then': { '$last': '$messages.read' },
              'else': true,
            }
          },
          unreadMessagesCount: {
            $sum: {
              $map: {
                'input': '$messages',
                'as': 'message',
                'in': {
                  $cond: {
                    'if': {
                      $and: [
                        { $eq: ['$$message.recipient', ObjectId(authUser._id)] },
                        { $eq: ['$$message.read', false] },
                      ]
                    },
                    'then': 1,
                    'else': 0,
                  }
                }
              }
            }
          },
        }
      },
      {
        $project: {
          recipientName: 1,
          message: 1,
          username: 1,
          lastMessageWasRead: 1,
          unreadMessagesCount: 1,
          updatedAt: 1,
        }
      }
    ])
      .sort({
        recipientName: -1,
        message: -1,
        updatedAt: -1
      })
      .toArray();

    res.status(200).json({
      searchMessages,
    });

  } catch (error) {
    console.log(`Error in /api/conversations\n`, error);
    throw new Error(error);
  }
})

/* ************************************************** */
/*
  View the conversation with a user through the user's profile page
*/

router.get('/api/conversation/user/:userId', async (req, res) => {
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

      /* Create the new conversation.  Send the ID. */
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

/* ************************************************** */
/*
  Get the conversation with a user
  after the conversation page loads
*/

router.get('/api/conversation/:conversationId', async (req, res) => {
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
      recipient: conversationsCollection.users.recipient,
      authUser,
      messages,
    });
  } catch (error) {
    console.log(`Error in /api/conversation/:conversationId\n`, error);
    throw new Error(error);
  }
})

router.delete('/api/conversation/delete/:conversationId', async (req, res) => {
  const conversationId = req.params.conversationId;

  try {
    const conversationsCollection = await messagesCollection().findOne({ _id: ObjectId(conversationId) })

    if (conversationsCollection?.messages?.length === 0) {
      await messagesCollection().deleteOne({ _id: ObjectId(conversationId) });

      res.status(200).json({
        conversationIsDeleted: true,
      })
    }
  } catch (error) {
    console.log(`Error in /api/conversation/delete/:conversationId\n`, error);
    throw new Error(error);
  }
})

/* ************************************************** */
/*
  Send a new message to a user
*/

router.post('/api/new-message', async (req, res) => {
  const { authUser } = req;
  const { conversationId, messageText } = req.body;

  let conversationsCollection = await messagesCollection().findOne({ _id: ObjectId(conversationId) })
  try {
    const now = new Date();
    const messageDate = now.toLocaleDateString();
    const message = {
      $set: { updatedAt: new Date() },
      $push: {
        messages: {
          sender: authUser._id,
          recipient: String(authUser._id) === String(conversationsCollection.recipientId) ? conversationsCollection.createdByUserId : conversationsCollection.recipientId,
          messageText,
          messageDate,
          read: false,
        }
      }
    }

    await messagesCollection().updateOne({ _id: conversationsCollection._id }, message);
    conversationsCollection = await messagesCollection().findOne({ _id: ObjectId(conversationId) })

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
    })
      .sort({ 'updatedAt': -1 })
      .limit(50)
      .forEach(conversation => {
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

    const recipient = String(authUser._id) === String(conversationsCollection.recipientId) ? conversationsCollection.users.createdByUser : conversationsCollection.users.recipient;
    let url = `${process.env.MY_MATCH_HEROKU}/messages/${conversationId}`;
    if (process.env.NODE_ENV === 'localhost') {
      url = `${process.env.MY_MATCH_LOCALHOST}/messages/${conversationId}`;
    }

    const subject = `You have a new message from ${authUser.name}`;
    const emailBody = `
      <body style="
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        background: #e5e5e5;
      ">
        <div style="${emailBodyContainerStyles}">
          ${emailHeader({ recipientName: recipient.name })}
          <p style="${paragraphStyles({})}">${authUser.name} just sent you a message.</p>
          ${ctaButton({
            ctaButtonUrl: url,
            ctaButtonText: 'Go To Messages'
          })}
          ${emailSignature}
        </div>
      </body>
    `;

    await sendEmail(recipient.email, subject, emailBody)

    res.status(200).json({
      allConversations,
      messageDate,
      conversationId,
    });
  } catch (error) {
    console.log(`Error in /api/new-message\n`, error);
    throw new Error(error);
  }
})

module.exports = router;
