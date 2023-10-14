const express = require('express');

const { usersCollection } = require('../db.js');
const { redirectToLogin } = require('../utils.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { authUser, allConversationsCount } = req;
    const originalUrl = req.originalUrl.split('?')[0];
    const page = parseInt(req.query.page) || 1;
    const skipRecords = page > 1 ? (page - 1) * 20 : 0;
    const authUserSearchOptions = authUser.searchOptions?.data ?? {};

    /* This code block handles all use cases where "Doesn't matter" is selected. */
    for (const [key, value] of Object.entries(authUserSearchOptions)) {
      if (
        (typeof value === 'string' && value.includes('DoesNotMatter')) ||
        (typeof value === 'object' && value.$in?.length === 0)
      ) {
        authUserSearchOptions[key] = { $exists: true }
      }
    }

    authUserSearchOptions.photos = authUserSearchOptions.photos ? { $ne: [] } : { $exists: true };
    delete authUserSearchOptions.canRelocate;

    const search = {
      $and: [
        {
          ...authUserSearchOptions,
        },
        {
          $or: [
            {
              $and: [
                {
                  $expr: {
                    $eq: ['$canRelocate', 'canRelocateYes'],
                  }
                },
                {
                  $or: [
                    {
                      'searchOptions.data.$or': {
                        $exists: true,
                        $in: [
                          {
                            city: authUser.city,
                            state: authUser.state,
                            country: authUser.country,
                          },
                          {
                            city: { $exists: true },
                            state: authUser.state,
                            country: authUser.country,
                          },
                          {
                            city: authUser.city,
                            state: { $exists: true },
                            country: authUser.country,
                          },
                          {
                            city: { $exists: true },
                            state: { $exists: true },
                            country: authUser.country,
                          },
                        ],
                      },
                    },
                    {
                      'searchOptions.data.$or': {
                        $exists: false,
                      },
                    },
                  ]
                },
              ],
            },
            {
              $and: [
                {
                  $expr: {
                    $eq: ['$canRelocate', 'canRelocateNo'],
                  }
                },
                {
                  $expr: {
                    $eq: [authUser.canRelocate, 'canRelocateYes'],
                  }
                },
                {
                  $or: [
                    {
                      'searchOptions.data.$or': {
                        $exists: true,
                        $in: [
                          {
                            city: authUser.city,
                            state: authUser.state,
                            country: authUser.country,
                          },
                          {
                            city: { $exists: true },
                            state: authUser.state,
                            country: authUser.country,
                          },
                          {
                            city: authUser.city,
                            state: { $exists: true },
                            country: authUser.country,
                          },
                          {
                            city: { $exists: true },
                            state: { $exists: true },
                            country: authUser.country,
                          },
                        ],
                      },
                    },
                    {
                      'searchOptions.data.$or': {
                        $exists: false,
                      },
                    },
                  ]
                },
              ],
            }
          ]
        },
        {
          $or: [
            {
              'searchOptions.data.languages.$in': {
                $in: authUser.languages,
              },
            },
            {
              'searchOptions.data.languages.$in': {
                $eq: [],
              },
            },
          ]
        },
        {
          $or: [
            {
              'searchOptions.data.profession.$in': {
                $in: [authUser.profession],
              },
            },
            {
              'searchOptions.data.profession.$in': {
                $eq: [],
              },
            },
          ]
        },
        {
          $or: [
            {
              'searchOptions.data.hobbies.$in': {
                $in: [authUser.hobbies],
              },
            },
            {
              'searchOptions.data.hobbies.$in': {
                $eq: [],
              },
            },
          ]
        },
        {
          $or: [
            {
              'searchOptions.data.maritalStatus.$in': {
                $in: [authUser.maritalStatus],
              },
            },
            {
              'searchOptions.data.maritalStatus.$in': {
                $eq: [],
              },
            },
          ]
        },
        {
          $or: [
            {
              'searchOptions.data.religiousConviction.$in': {
                $in: [authUser.religiousConviction],
              },
            },
            {
              'searchOptions.data.religiousConviction.$in': {
                $eq: [],
              },
            },
          ]
        },
        {
          $or: [
            {
              'searchOptions.data.religiousValues.$in': {
                $in: [authUser.religiousValues],
              },
            },
            {
              'searchOptions.data.religiousValues.$in': {
                $eq: [],
              },
            },
          ]
        },
        {
          $or: [
            {
              'searchOptions.data.education.$in': {
                $in: [authUser.education],
              },
            },
            {
              'searchOptions.data.education.$in': {
                $eq: [],
              },
            },
          ]
        },
        {
          $expr: {
            $eq: [
              {
                $cond: [
                  {
                    $eq: [
                      '$searchOptions.data.hasChildren', 'hasChildrenDoesNotMatter'
                    ],
                  },
                  1,
                  {
                    $cond: [
                      {
                        $eq: [
                          '$searchOptions.data.hasChildren', authUser.hasChildren,
                        ],
                      },
                      1,
                      0
                    ],
                  }
                ],
              },
              1,
            ]
          }
        },
        {
          $expr: {
            $eq: [
              {
                $cond: [
                  {
                    $eq: [
                      '$searchOptions.data.wantsChildren', 'wantsChildrenDoesNotMatter'
                    ],
                  },
                  1,
                  {
                    $cond: [
                      {
                        $eq: [
                          '$searchOptions.data.wantsChildren', authUser.wantsChildren,
                        ],
                      },
                      1,
                      0
                    ],
                  }
                ],
              },
              1,
            ]
          }
        },
        {
          $expr: {
            $eq: [
              {
                $cond: [
                  {
                    $eq: [
                      '$searchOptions.data.hijab', 'hijabDoesNotMatter'
                    ],
                  },
                  1,
                  {
                    $cond: [
                      {
                        $eq: [
                          '$searchOptions.data.hijab', authUser.hijab,
                        ],
                      },
                      1,
                      0
                    ],
                  }
                ],
              },
              1,
            ]
          }
        },
        {
          $expr: {
            $eq: [
              {
                $cond: [
                  {
                    $eq: [
                      '$searchOptions.data.smokes', 'smokesDoesNotMatter'
                    ],
                  },
                  1,
                  {
                    $cond: [
                      {
                        $eq: [
                          '$searchOptions.data.smokes', authUser.smokes,
                        ],
                      },
                      1,
                      0
                    ],
                  }
                ],
              },
              1,
            ]
          }
        },
        {
          $or: [
            {
              'searchOptions.data.ethnicity.$in': {
                $in: authUser.ethnicity,
              },
            },
            {
              'searchOptions.data.ethnicity.$in': {
                $eq: [],
              },
            },
          ]
        },
        {
          $or: [
            {
              'searchOptions.data.diet.$in': {
                $in: [authUser.diet],
              },
            },
            {
              'searchOptions.data.diet.$in': {
                $eq: [],
              },
            },
          ]
        },
        {
          $or: [
            {
              'searchOptions.data.age.$exists': {
                $exists: true,
              },
            },
            {
              $and: [
                {
                  'searchOptions.data.age.$gte': {
                    $lte: authUser.age,
                  },
                },
                {
                  'searchOptions.data.age.$lte': {
                    $gte: authUser.age,
                  },
                },
              ]
            },
          ]
        },
        {
          $or: [
            {
              'searchOptions.data.height.$exists': {
                $exists: true,
              },
            },
            {
              $and: [
                {
                  'searchOptions.data.height.$gte': {
                    $lte: authUser.height,
                  },
                },
                {
                  'searchOptions.data.height.$lte': {
                    $gte: authUser.height,
                  },
                },
              ]
            },
          ]
        },
        {
          $or: [
            {
              'searchOptions.data.prayerLevel.$in': {
                $in: [authUser.prayerLevel],
              },
            },
            {
              'searchOptions.data.prayerLevel.$in': {
                $eq: [],
              },
            },
          ]
        },
        {
          _id: {
            $nin: authUser.blockedUsers,
          },
        },
        {
          blockedUsers: {
            $nin: [authUser._id],
          },
        },
      ]
    }

    const allUsersCount = await usersCollection()
      .find(search)
      .count();

    const sortResultsDictionary = {
      'lastActive': {
        'lastActive.utc': -1,
      },
      'newestMembers': {
        completedRegistrationAt: -1,
      },
      'nearestToYou': {},
    };

    const searchOptionsSortResults = authUser.searchOptions?.sortResults;
    const sortResults = sortResultsDictionary[searchOptionsSortResults];

    let allUsers = await usersCollection()
      .find(search)
      .sort(sortResults)
      .skip(skipRecords)
      .limit(20)
      .toArray();

    allUsers = allUsers.map(user => {
      const userPHotos = user.photos.map(photo => photo.secure_url)
      return {
        ...user,
        photos: userPHotos,
      }
    })

    const numberOfPages = Math.ceil(allUsersCount / 20) || 1;
    const currentPage = page || 1;
    const previousPage = currentPage > 1 ? currentPage - 1 : 0;
    const nextPage = currentPage < numberOfPages ? currentPage + 1 : null;

    if (currentPage <= numberOfPages) {
      return res.render('app/_layouts/index', {
        locals: {
          title: 'Zawajina',
          styles: [
            '/static/client/views/app/home/styles.css',
            '/static/client/views/app/_partials/app-nav.css',
          ],
          scripts: [
            '/static/client/views/app/home/init.js',
          ],
          authUser,
          allConversationsCount,
          allUsersCount,
          allUsers,
          previousPage,
          numberOfPages,
          currentPage,
          nextPage,
          originalUrl,
        },
        partials: {
          nav: 'app/_partials/app-nav',
          body: 'app/home/index',
        },
      });
    }

    if (currentPage > numberOfPages) return res.redirect(`/users?page=${numberOfPages}`);

    return res.redirect(`/users`);
  } catch (error) {
    redirectToLogin(error, res);
  }
});

module.exports = router;
