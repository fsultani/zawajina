const express = require('express');
const { ObjectId } = require('mongodb');

const { getAllFiles, redirectToLogin, returnServerError, escapeHtml } = require('../utils');
const { usersCollection, messagesCollection } = require('../db');
const {
  emailBodyContainerStyles,
  emailHeader,
  paragraphStyles,
  ctaButton,
  emailSignature,
} = require('../email-templates/components');
const { sendEmail } = require('../helpers/email');

const router = express.Router();

router.get('/:conversationId?', async (req, res) => {
  try {
    const conversationId = ObjectId(req.params.conversationId);
    const { authUser, allConversationsCount } = req;

    const conversationsCollection = await messagesCollection().findOne({ _id: conversationId })
    const users = conversationsCollection?.users ?? {};

    const directoryPath = ['client/views/app/messages'];

    const stylesArray = [
      '/static/assets/styles/fontawesome-free-5.15.4-web/css/all.css',
      '/static/client/views/app/_partials/app-nav.css',
    ];

    const scriptsArray = [
      '/static/assets/apis/axios.min.js',
      '/static/assets/apis/js.cookie.min.js',
    ];

    const styles = getAllFiles({ directoryPath, fileType: 'css', filesArray: stylesArray });
    const scripts = getAllFiles({ directoryPath, fileType: 'js', filesArray: scriptsArray });

    res.render('app/_layouts/index', {
      locals: {
        title: 'Zawajina',
        styles,
        scripts,
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
  } catch (error) {
    redirectToLogin(error, res);
  }
});

/* ************************************************** */
/*
  Get all conversations using aggregate().
*/

router.get('/api/conversations', async (req, res) => {
  try {
    const { authUser, allConversationsCount } = req;
    const { page } = req.query;
    const limit = 50;
    const skipRecords = page > 1 ? (page - 1) * limit : 0;
    const authUserId = ObjectId(authUser._id);

    const allConversationsSidebar = await messagesCollection().aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                {
                  'createdBy._id': authUserId
                },
                {
                  'otherUser._id': authUserId,
                }
              ]
            },
            {
              [`messages.isVisibleForUser_${authUserId}`]: true,
            },
          ]
        }
      },
      {
        $addFields: {
          otherUser: {
            $cond: {
              'if': {
                $eq: ['$otherUser._id', authUserId]
              },
              'then': '$createdBy.name',
              'else': '$otherUser.name',
            }
          },
          lastMessagePreview: {
            $substrBytes: [{ '$last': '$messages.messageText' }, 0, 50]
          },
          lastMessageWasRead: {
            $cond: {
              'if': {
                $eq: [{ '$last': '$messages.messageOtherUserId' }, authUserId]
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
                        { $eq: ['$$message.messageOtherUserId', authUserId] },
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
    returnServerError(res, error);
  }
})

/* ************************************************** */
/*
  Get messages search query,
*/
router.get('/api/conversations/search', async (req, res) => {
  try {
    const { authUser } = req;
    const searchQuery = escapeHtml(req.query.searchQuery);
    const authUserId = ObjectId(authUser._id);

    const searchQueryRegex = new RegExp(searchQuery, 'ig')
    const searchMessages = await messagesCollection().aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                {
                  'createdBy._id': authUserId
                },
                {
                  'otherUser._id': authUserId,
                }
              ]
            },
            {
              $or: [
                {
                  'otherUser.name': {
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
          otherUserName: {
            $regexMatch: {
              input: '$otherUser.name',
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
                $eq: ['$otherUser._id', authUserId],
              },
              'then': '$createdBy.name',
              'else': '$otherUser.name',
            }
          },
          lastMessageWasRead: {
            $cond: {
              'if': {
                $eq: [{ '$last': '$messages.messageOtherUserId' }, authUserId],
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
                        { $eq: ['$$message.messageOtherUserId', authUserId] },
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
          otherUserName: 1,
          message: 1,
          username: 1,
          lastMessageWasRead: 1,
          unreadMessagesCount: 1,
          updatedAt: 1,
        }
      }
    ])
      .sort({
        otherUserName: -1,
        message: -1,
        updatedAt: -1
      })
      .toArray();

    res.status(200).json({
      searchMessages,
    });

  } catch (error) {
    returnServerError(res, error);
  }
})

/* ************************************************** */
/*
  View the conversation with a user through the user's profile page.
*/
router.get('/api/conversation/user/:userId', async (req, res) => {
  try {
    const { authUser } = req;
    const authUserId = ObjectId(authUser._id);
    const otherUserId = ObjectId(req.params.userId);

    /* Conversation was accessed by clicking on the message button from the user's profile. */
    const conversationsCollection = await messagesCollection().findOne({
      $or: [
        {
          $and: [
            { 'otherUser._id': authUserId },
            { 'createdBy._id': otherUserId }
          ]
        },
        {
          $and: [
            { 'otherUser._id': otherUserId },
            { 'createdBy._id': authUserId }
          ]
        },
      ]
    })

    const otherUser = await usersCollection().findOne({ _id: otherUserId });

    /* No conversation exists.  Create a new one. */
    if (!conversationsCollection) {
      const conversation = {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: {
          _id: authUserId,
          name: authUser.name,
          email: authUser.email,
          age: authUser.age,
          city: authUser.city,
          state: authUser?.state,
          country: authUser.country,
        },
        otherUser: {
          _id: otherUserId,
          name: otherUser.name,
          email: otherUser.email,
          age: otherUser.age,
          city: otherUser.city,
          state: otherUser?.state,
          country: otherUser.country,
        },
        messages: [],
      }

      /* Create the new conversation.  Send the _id. */
      const newConversation = await messagesCollection().insertOne(conversation);
      const conversationId = newConversation.insertedId;
      res.status(201).send({ url: `/messages/${conversationId}` });
    } else {
      /* A conversation exists.  Send the _id. */
      const conversationId = conversationsCollection._id;
      res.status(200).send({ url: `/messages/${conversationId}` });
    }
  } catch (error) {
    returnServerError(res, error);
  }
})

/* ************************************************** */
/*
  Get the conversation with a user after the conversation page loads.
*/
router.get('/api/conversation/:conversationId', async (req, res) => {
  try {
    const { authUser } = req;
    const authUserId = ObjectId(authUser._id);
    const conversationId = ObjectId(req.params.conversationId);

    await messagesCollection().updateOne(
      {
        _id: conversationId,
      },
      { $set: { "messages.$[element].read": true } },
      {
        multi: true,
        arrayFilters: [
          {
            "element.messageOtherUserId": authUserId,
          }
        ]
      }
    )

    const conversationUsers = await messagesCollection().findOne({
      _id: conversationId,
    })

    const otherUser = String(authUser._id) === String(conversationUsers.otherUser._id) ? conversationUsers.createdBy : conversationUsers.otherUser;
    const otherUserId = ObjectId(otherUser._id);

    const blockedByAuthUserArray = authUser.blockedUsers;

    const blockedByOtherUser = await usersCollection().find({
      _id: otherUserId,
    })
      .project({ blockedUsers: 1 })
      .toArray();

    const blockedByOtherUserArray = blockedByOtherUser[0]?.blockedUsers ?? [];

    /* Conversation was accessed by clicking on the message button from the user's profile. */
    const conversationsCollection = await messagesCollection().aggregate([
      {
        $match: {
          _id: conversationId,
        }
      },
      {
        $addFields: {
          messages: {
            $filter: {
              input: '$messages',
              as: 'message',
              cond: {
                $and: [
                  { $eq: [`$$message.isVisibleForUser_${authUserId}`, true] },
                ]
              }
            }
          },
          blockedBy: {
            $switch: {
              branches: [
                {
                  case: {
                    $in: [otherUserId, blockedByAuthUserArray],
                  },
                  then: {
                    authUser: `You have blocked ${otherUser.name}`
                  }
                },
                {
                  case: {
                    $in: [authUserId, blockedByOtherUserArray],
                  },
                  then: {
                    otherUser: `${otherUser.name} has blocked you`
                  }
                },
              ],
              default: null,
            }
          }
        }
      },
      {
        $project: {
          otherUser: 1,
          messages: 1,
          blockedBy: 1,
        }
      }
    ]).toArray();

    if (!conversationsCollection.length) return res.sendStatus(404);

    const conversation = conversationsCollection[0];
    const {
      messages,
      blockedBy,
    } = conversation;

    res.status(200).send({
      authUser,
      conversationId,
      otherUser,
      messages,
      blockedBy,
    });
  } catch (error) {
    returnServerError(res, error);
  }
})

/* ************************************************** */
/*
  Send a new message to a user.
*/
router.post('/api/new-message', async (req, res) => {
  try {
    const { authUser } = req;
    const authUserId = ObjectId(authUser._id);
    let conversationId = ObjectId(req.body.conversationId);
    const messageText = escapeHtml(req.body.messageText.trim());
    const otherUserId = ObjectId(req.body.otherUserId);
    const otherUser = await usersCollection().findOne({ _id: otherUserId });

    const blockedByAuthUserArray = authUser.blockedUsers;
    const otherUserIsBlocked = blockedByAuthUserArray.findIndex(item => item.toString() === otherUserId.toString()) > -1;

    /* authUser has blocked otherUser */
    if (otherUserIsBlocked) return res.status(405).send({ message: `${otherUser.name} is blocked and cannot be messaged` })

    const blockedByOtherUser = !!await usersCollection().findOne({
      _id: otherUserId,
      blockedUsers: {
        $in: [authUserId]
      }
    })

    /* otherUser has blocked authUser. */
    if (blockedByOtherUser) return res.status(405).send({ message: `${otherUser.name} has blocked you` })

    const conversationsCollection = await messagesCollection().findOne({ _id: conversationId });
    if (!conversationsCollection) {
      const conversation = {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: {
          _id: authUserId,
          name: authUser.name,
          email: authUser.email,
          age: authUser.age,
          city: authUser.city,
          state: authUser?.state,
          country: authUser.country,
        },
        otherUser: {
          _id: otherUser._id,
          name: otherUser.name,
          email: otherUser.email,
          age: otherUser.age,
          city: otherUser.city,
          state: otherUser?.state,
          country: otherUser.country,
        },
        messages: [],
      }

      const newConversation = await messagesCollection().insertOne(conversation);
      conversationId = newConversation.insertedId;
    }

    const now = new Date();
    const messageDate = now.toLocaleDateString();

    const message = {
      $set: { updatedAt: new Date() },
      $push: {
        messages: {
          messageSenderId: authUserId,
          messageOtherUserId: otherUserId,
          messageText,
          messageDate,
          read: false,
          [`isVisibleForUser_${authUserId}`]: true,
          [`isVisibleForUser_${otherUserId}`]: true,
        }
      }
    }

    await messagesCollection().updateOne({ _id: conversationId }, message);

    const allConversationsSidebar = await messagesCollection().aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                {
                  'createdBy._id': authUserId
                },
                {
                  'otherUser._id': authUserId,
                }
              ]
            },
            {
              [`messages.isVisibleForUser_${authUserId}`]: true,
            }
          ]
        }
      },
      {
        $addFields: {
          otherUser: {
            $cond: {
              'if': {
                $eq: ['$otherUser._id', authUserId]
              },
              'then': '$createdBy.name',
              'else': '$otherUser.name',
            }
          },
          lastMessagePreview: {
            $substrBytes: [{ '$last': '$messages.messageText' }, 0, 50]
          },
          lastMessageWasRead: {
            $cond: {
              'if': {
                $eq: [{ '$last': '$messages.messageOtherUserId' }, authUserId]
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
                        { $eq: ['$$message.messageOtherUserId', authUserId] },
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
      .limit(50)
      .toArray();

    const recipientName = otherUser.name;
    const conversationIdString = req.body.conversationId;
    const url = `${process.env.HOST_URL}/messages/${conversationIdString}`;

    const subject = `You have a new message from ${authUser.name}`;
    const emailBody = `
      <div style="${emailBodyContainerStyles}">
        ${emailHeader({ recipientName })}
        <p style="${paragraphStyles({})}">${authUser.name} just sent you a message.</p>

        ${ctaButton({ ctaButtonUrl: url, ctaButtonText: 'Go To Messages' })}
        ${emailSignature}

        </div>
      </div>
    `;

    await sendEmail({ emailAddress: otherUser.email, subject, emailBody });
    // if (process.env.NODE_ENV !== 'development') {
    // }

    res.status(200).send({
      allConversationsSidebar,
      messageDate,
      conversationId,
    });
  } catch (error) {
    returnServerError(res, error);
  }
})

/* ************************************************** */
/*
  Delete a conversation by hiding all messages.
*/
router.put('/api/conversation/delete/:conversationId', async (req, res) => {
  try {
    const authUserId = req.authUser._id;
    const conversationId = ObjectId(req.params.conversationId);

    await messagesCollection().updateOne(
      {
        _id: conversationId,
      },
      {
        $set: {
          [`messages.$[element].isVisibleForUser_${authUserId}`]: false,
        }
      },
      {
        multi: true,
        arrayFilters: [
          {
            [`element.isVisibleForUser_${authUserId}`]: true,
          }
        ]
      }
    )

    res.status(200).send({ url: '/messages' });
  } catch (error) {
    returnServerError(res, error);
  }
})

/* ************************************************** */
/*
  Delete a conversation from the db if a user starts a new conversation, but never sends a message.
*/
router.delete('/api/conversation/delete/:conversationId', async (req, res) => {
  try {
    const conversationId = ObjectId(req.params.conversationId);
    const conversationsCollection = await messagesCollection().findOne({ _id: conversationId })

    if (conversationsCollection?.messages?.length === 0) {
      await messagesCollection().deleteOne({ _id: conversationId });

      res.status(200).json({
        conversationIsDeleted: true,
      })
    }
  } catch (error) {
    returnServerError(res, error);
  }
})

module.exports = router;
