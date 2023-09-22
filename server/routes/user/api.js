const express = require('express');
const { ObjectId } = require('mongodb');

const { usersCollection, insertLogs } = require('../../db.js');
const { uploadToCloudinary, deleteFromCloudinary } = require('../../helpers/cloudinary');
const upload = require('../../helpers/multer');
const {
  calculateImperialHeight,
  getLastActive,
} = require('./utils');
const { escapeHtml, redirectToLogin, returnServerError, camelCaseToTitleCase } = require('../../utils');

const router = express.Router();

router.get('/profile-details/auth-user/:userId', async (req, res) => {
  try {
    let { authUser } = req;
    const { userId } = req.params;

    if (!authUser || !userId) return res.redirect('/users');

    const imperialHeight = calculateImperialHeight(authUser.height);
    const userHeight = `${imperialHeight.heightInFeet}'${imperialHeight.heightInInches}" (${authUser.height} cm)`;
    const lastActive = await getLastActive(userId);

    authUser = {
      ...authUser,
      height: userHeight,
      lastActive,
    };

    res.status(200).json({
      authUser
    });
  } catch (error) {
    redirectToLogin(error, res);
  }
});

router.put(
  '/profile-details/photos',
  upload.fields([{
    name: 'image-0',
    maxCount: 1,
  },
  {
    name: 'image-1',
    maxCount: 1,
  },
  {
    name: 'image-2',
    maxCount: 1,
  },
  {
    name: 'image-3',
    maxCount: 1,
  },
  {
    name: 'image-4',
    maxCount: 1,
  },
  {
    name: 'image-5',
    maxCount: 1,
  },
  ]),
  async (req, res) => {
    try {
      const { authUser } = req;

      const userId = authUser._id;

      let userPhotos = [];
      let authUserPhotos = [...authUser.photos]
      let newUploadedPhotos = [];
      let deletedPhotos = [];
      let publicIds = [];
      let logsUpdate = {};

      if (req.body.photos) {
        const photos = JSON.parse(req.body.photos);

        /* Upload new photos first */
        let newPhotos = photos.filter(photo => photo.image?.startsWith('blob:'));
        if (newPhotos.length > 0) {
          const response = await uploadToCloudinary({
            req,
            userId,
          });

          newUploadedPhotos = [...newUploadedPhotos, ...response];
          const photos = response.map(item => ({
            index: `null => ${item.index}`,
            public_id: item.public_id,
            secure_url: item.secure_url,
          }))

          logsUpdate = {
            ...logsUpdate,
            photos,
          }
        }

        photos.map(photo => {
          if (photo.image?.startsWith('blob:')) {
            /* A new photo was uploaded */
            const newPhoto = newUploadedPhotos.find(newUploadedPhoto => newUploadedPhoto.index === photo.index)
            userPhotos.push(newPhoto)

            /* Check if the index of the new photo is currently occupied in the db */
            const existingPhotoByIndex = authUserPhotos.find(authUserPhoto => authUserPhoto.index === photo.index)
            if (existingPhotoByIndex) {
              /* The index of the new photo exists in the db */
              /* Get the photo from the client from its url */
              const existingPhotoByUrl = photos.find(photo => photo.image === existingPhotoByIndex.secure_url);
              if (existingPhotoByUrl) {
                const photos = {
                  index: `${existingPhotoByIndex.index} => ${0} - Replaced default photo with newuly uploaded photo`,
                  public_id: existingPhotoByIndex.public_id,
                  secure_url: existingPhotoByIndex.secure_url,
                }

                logsUpdate = {
                  ...logsUpdate,
                  photos,
                }
              } else {
                /* A new photo replaced an existing photo, so delete the existing photo first */
                publicIds.push(existingPhotoByIndex.public_id)
                deletedPhotos.push(existingPhotoByIndex)

                const photos = {
                  index: `${existingPhotoByIndex.index} => ${newPhoto.index}`,
                  public_id: `${existingPhotoByIndex.public_id} => ${newPhoto.public_id}`,
                  secure_url: `${existingPhotoByIndex.secure_url} => ${newPhoto.secure_url}`,
                }

                logsUpdate = {
                  ...logsUpdate,
                  photos,
                }
              }
            }
          } else if (photo.image === 'undefined') {
            /* A photo does not exist; check if it was deleted */
            const existingPhotoByIndex = authUserPhotos.find(authUserPhoto => authUserPhoto.index === photo.index)
            if (existingPhotoByIndex) {
              /* Delete an existing photo without replacing it */
              publicIds.push(existingPhotoByIndex.public_id)
              deletedPhotos.push(existingPhotoByIndex)

              const photos = {
                index: `${existingPhotoByIndex.index} => null`,
                public_id: existingPhotoByIndex.public_id,
                secure_url: existingPhotoByIndex.secure_url,
              }

              logsUpdate = {
                ...logsUpdate,
                photos,
              }
            }
          } else {
            /* A photo exists and is not new */
            const existingPhotoByUrl = authUserPhotos.find(authUserPhoto => authUserPhoto.secure_url === photo.image)
            if (existingPhotoByUrl) {
              /* Check if the default photo was changed */
              if (existingPhotoByUrl.secure_url === photo.image && existingPhotoByUrl.index !== photo.index && photo.index === 0) {

                const photos = {
                  index: `${existingPhotoByUrl.index} => ${0}`,
                  public_id: existingPhotoByUrl.public_id,
                  secure_url: existingPhotoByUrl.secure_url,
                }

                logsUpdate = {
                  ...logsUpdate,
                  photos,
                }

                existingPhotoByUrl.index = 0;
              } else {
                existingPhotoByUrl.index = photo.index;
              }
              userPhotos.push(existingPhotoByUrl)
            }
          }
        })

        if (publicIds.length > 0) {
          await deleteFromCloudinary({
            publicIds
          });
        }

        userPhotos.sort((a, b) => a.index - b.index);
        userPhotos = userPhotos.map((item, index) => ({
          ...item,
          index,
        }));
      }

      const everyPhotoIsValid = userPhotos.every(photo => {
        const photoHasIndex = !isNaN(photo.index);
        const photoHasPublicId = photo.public_id?.length > 0;
        const photoHasSecureUrl = photo.secure_url?.length > 0;
        const photoHasApprovedField = photo.approvalStatus?.length > 0;

        return photoHasIndex && photoHasPublicId && photoHasSecureUrl && photoHasApprovedField;
      })

      if (everyPhotoIsValid) {
        usersCollection().findOneAndUpdate({
          _id: userId
        }, {
          $set: {
            photos: userPhotos,
          },
        }, {
          returnDocument: 'after',
          returnNewDocument: true,
        },
          async () => {
            insertLogs(req, {
              ...logsUpdate,
            });

            return res.sendStatus(200);
          }
        );
      } else {
        return res.sendStatus(500);
      }
    } catch (error) {
      returnServerError(res, error);
    }
  }
);

router.put('/profile-details/location', async (req, res) => {
  try {
    const { authUser } = req;

    const userId = authUser._id;

    const updatedUserCity = req.body.city;
    const updatedUserState = req.body.state === 'null' ? null : req.body.state;
    const updatedUserCountry = req.body.country;

    if (authUser.country !== updatedUserCountry) {
      usersCollection().findOneAndUpdate({
        _id: userId,
      }, {
        $set: {
          city: updatedUserCity,
          state: updatedUserState,
          country: updatedUserCountry,
        },
      }, {
        returnDocument: 'after',
        returnNewDocument: true,
      },
        async (_, user) => {
          insertLogs(req, {
            city: user.value.city,
            state: user.value.state,
            country: user.value.country,
          });

          return res.status(200).json({
            response: {
              city: user.value.city,
              state: user.value.state,
              country: user.value.country,
            }
          });
        }
      );
    } else if (authUser.state !== updatedUserState) {
      usersCollection().findOneAndUpdate({
        _id: userId,
      }, {
        $set: {
          city: updatedUserCity,
          state: updatedUserState,
        },
      }, {
        returnDocument: 'after',
        returnNewDocument: true,
      },
        async (_, user) => {
          insertLogs(req, {
            city: user.value.city,
            state: user.value.state,
          });

          return res.status(200).json({
            response: {
              city: user.value.city,
              state: user.value.state,
              country: user.value.country,
            }
          });
        }
      );
    } else if (authUser.city !== updatedUserCity) {
      usersCollection().findOneAndUpdate({
        _id: userId,
      }, {
        $set: {
          city: updatedUserCity,
        },
      }, {
        returnDocument: 'after',
        returnNewDocument: true,
      },
        async (_, user) => {
          insertLogs(req, {
            city: user.value.city,
          });

          return res.json({
            response: {
              city: user.value.city,
              state: user.value.state,
              country: user.value.country,
            }
          });
        }
      );
    }
  } catch (error) {
    returnServerError(res, error);
  }
});

router.put('/profile-details/user-details', async (req, res) => {
  try {
    const { authUser } = req;

    const userId = authUser._id;
    const currentUserDocument = authUser;
    let updatedUserInfo = {}

    function arrayEquals(a, b) {
      return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
    }

    const {
      religiousConviction,
      religiousValues,
      maritalStatus,
      education,
      profession,
      userLanguages,
      hasChildren,
      wantsChildren,
      prayerLevel,
      hijab,
      canRelocate,
      diet,
      smokes,
      userHobbies,
    } = req.body;

    if (religiousConviction !== currentUserDocument.religiousConviction) {
      updatedUserInfo = {
        ...updatedUserInfo,
        religiousConviction,
      }
    }

    if (religiousValues !== currentUserDocument.religiousValues) {
      updatedUserInfo = {
        ...updatedUserInfo,
        religiousValues,
      }
    }

    if (maritalStatus !== currentUserDocument.maritalStatus) {
      updatedUserInfo = {
        ...updatedUserInfo,
        maritalStatus,
      }
    }

    if (education !== currentUserDocument.education) {
      updatedUserInfo = {
        ...updatedUserInfo,
        education,
      }
    }

    if (profession !== currentUserDocument.profession) {
      updatedUserInfo = {
        ...updatedUserInfo,
        profession,
      }
    }

    if (userLanguages?.length > 0) {
      if (userLanguages.length !== currentUserDocument.languages.length || !arrayEquals(userLanguages, currentUserDocument.languages)) {
        updatedUserInfo = {
          ...updatedUserInfo,
          languages: [...userLanguages]
        }
      }
    }

    if (hasChildren !== currentUserDocument.hasChildren) {
      updatedUserInfo = {
        ...updatedUserInfo,
        hasChildren,
      }
    }

    if (wantsChildren !== currentUserDocument.wantsChildren) {
      updatedUserInfo = {
        ...updatedUserInfo,
        wantsChildren,
      }
    }

    if (prayerLevel !== currentUserDocument.prayerLevel) {
      updatedUserInfo = {
        ...updatedUserInfo,
        prayerLevel,
      }
    }

    if (hijab !== currentUserDocument.hijab) {
      updatedUserInfo = {
        ...updatedUserInfo,
        hijab,
      }
    }

    if (canRelocate !== currentUserDocument.canRelocate) {
      updatedUserInfo = {
        ...updatedUserInfo,
        canRelocate,
      }
    }

    if (diet !== currentUserDocument.diet) {
      updatedUserInfo = {
        ...updatedUserInfo,
        diet,
      }
    }

    if (smokes !== currentUserDocument.smokes) {
      updatedUserInfo = {
        ...updatedUserInfo,
        smokes,
      }
    }

    if (userHobbies?.length > 0 !== currentUserDocument.hobbies) {
      if (userHobbies.length !== currentUserDocument.hobbies.length || !arrayEquals(userHobbies, currentUserDocument.hobbies)) {
        updatedUserInfo = {
          ...updatedUserInfo,
          hobbies: [...userHobbies],
        }
      }
    }

    usersCollection().findOneAndUpdate({ _id: userId }, {
      $set: {
        ...updatedUserInfo,
      },
    }, {
      returnDocument: 'after',
      returnNewDocument: true,
    },
      async (_, user) => {
        let authUser = user.value;
        const imperialHeight = calculateImperialHeight(authUser.height);
        const userHeight = `${imperialHeight.heightInFeet}'${imperialHeight.heightInInches}" (${authUser.height} cm)`;

        authUser = {
          ...authUser,
          height: userHeight,
        };

        const hijab = authUser.hijab ? camelCaseToTitleCase(authUser.hijab).split(' ')[1] : null;
        const hasChildren = camelCaseToTitleCase(authUser.hasChildren).split(' ')[2];
        const wantsChildren = camelCaseToTitleCase(authUser.wantsChildren).split(' ')[2];
        const canRelocate = camelCaseToTitleCase(authUser.canRelocate).split(' ').slice(2).map((word, index) => index > 0 ? word.toLowerCase() : word).join(', ');
        const smokes = camelCaseToTitleCase(authUser.smokes).split(' ')[1];

        authUser = {
          ...authUser,
          hasChildren,
          wantsChildren,
          canRelocate,
          smokes,
          hijab,
        };

        Object.entries(updatedUserInfo).filter(item => item[1]).map(async ([key, value]) => {
          insertLogs(
            req,
            {
              [key]: value,
            },
          );
        });

        return res.status(200).json({
          response: authUser,
        });
      }
    );
  } catch (error) {
    returnServerError(res, error);
  }
});

router.put('/profile-details/about-me', async (req, res) => {
  try {
    const { authUser } = req;

    const userId = authUser._id;
    const aboutMe = escapeHtml(req.body.aboutMe).trim();
    let accountStatus = authUser._account.admin.accountStatus;
    let userFacingMessage = authUser._account.admin.userFacingMessage;

    if (accountStatus === 'locked') {
      accountStatus = 'needsAdminReview';
      userFacingMessage = 'Account under review.  You may still update your account information and password.';
    }

    usersCollection().findOneAndUpdate({ _id: userId }, {
      $set: {
        aboutMe,
        "_account.admin.accountStatus": accountStatus,
        "_account.admin.userFacingMessage": userFacingMessage,
      },
    }, {
      returnDocument: 'after',
      returnNewDocument: true,
    },
      async (_, user) => {
        insertLogs(req, {
          aboutMe,
          '_account.admin.accountStatus': accountStatus,
          '_account.admin.userFacingMessage': userFacingMessage,
        });

        const userValue = user.value;

        return res.status(200).send({
          aboutMe: userValue.aboutMe,
          accountStatus: userValue._account.admin.accountStatus,
          userFacingMessage: userValue._account.admin.userFacingMessage,
        });
      }
    );
  } catch (error) {
    returnServerError(res, error);
  }
});

router.put('/profile-details/about-my-match', async (req, res) => {
  try {
    const { authUser } = req;

    const userId = authUser._id;
    const aboutMyMatch = escapeHtml(req.body.aboutMyMatch).trim();
    let accountStatus = authUser._account.admin.accountStatus;
    let userFacingMessage = authUser._account.admin.userFacingMessage;

    if (accountStatus === 'locked') {
      accountStatus = 'needsAdminReview';
      userFacingMessage = 'Account under review.  You may still update your account information and password.';
    }

    usersCollection().findOneAndUpdate({ _id: userId }, {
      $set: {
        aboutMyMatch,
        '_account.admin.accountStatus': accountStatus,
        '_account.admin.userFacingMessage': userFacingMessage,
      },
    }, {
      returnDocument: 'after',
      returnNewDocument: true,
    },
      async (_, user) => {
        insertLogs(req, {
          aboutMyMatch,
          '_account.admin.accountStatus': accountStatus,
          '_account.admin.userFacingMessage': userFacingMessage,
        });

        const userValue = user.value;

        return res.status(200).send({
          aboutMyMatch: userValue.aboutMyMatch,
          accountStatus: userValue._account.admin.accountStatus,
          userFacingMessage: userValue._account.admin.userFacingMessage,
        });
      }
    );
  } catch (error) {
    returnServerError(res, error);
  }
});

router.put('/like', async (req, res) => {
  try {
    const { authUser } = req;
    const { userId } = req.body;

    let userIsLiked = !!await usersCollection().findOne({
      _id: ObjectId(authUser._id),
      usersLiked: {
        $in: [ObjectId(userId)]
      }
    });

    if (!userIsLiked) {
      await usersCollection().findOneAndUpdate({
        _id: ObjectId(authUser._id)
      }, {
        $push: {
          usersLiked: ObjectId(userId),
        },
      });

      await usersCollection().findOneAndUpdate({
        _id: ObjectId(userId)
      }, {
        $push: {
          likedByUsers: ObjectId(authUser._id),
        },
      });

      const userLiked = await usersCollection().findOne({
        _id: ObjectId(userId)
      });

      return res.status(200).json({
        userIsLiked: true,
        userName: userLiked.name
      });
    } else {
      await usersCollection().findOneAndUpdate({
        _id: ObjectId(userId)
      }, {
        $pull: {
          likedByUsers: ObjectId(authUser._id),
        },
      });

      await usersCollection().findOneAndUpdate({
        _id: ObjectId(authUser._id)
      }, {
        $pull: {
          usersLiked: ObjectId(userId),
        },
      });

      return res.status(200).json({
        userIsLiked: false
      });
    }
  } catch (error) {
    returnServerError(res, error);
  }
})

router.put('/block', async (req, res) => {
  try {
    const authUserId = ObjectId(req.authUser._id);
    const userId = ObjectId(req.body.userId);

    const user = await usersCollection().findOne({ _id: userId });
    const userName = user.name;

    const userIsBlocked = !!await usersCollection().findOne({
      _id: authUserId,
      blockedUsers: {
        $in: [userId]
      }
    });

    if (userIsBlocked) {
      await usersCollection().findOneAndUpdate({
        _id: authUserId,
      }, {
        $pull: {
          blockedUsers: userId,
        },
      });

      return res.status(201).send({
        message: `${userName} has been unblocked`,
        userIsBlocked: false,
      });
    }

    await usersCollection().findOneAndUpdate({
      _id: authUserId,
    }, {
      $push: {
        blockedUsers: userId,
      },
    });

    return res.status(201).send({
      message: `${userName} has been blocked`,
      userIsBlocked: true,
    });
  } catch {
    return res.sendStatus(400);
  }
})

router.put('/report', async (req, res) => {
  try {
    const authUser = req.authUser;
    const authUserId = ObjectId(authUser._id);
    const userId = ObjectId(req.body.userId);

    const { reason, additionalInformation } = req.body;

    const user = await usersCollection().findOne({ _id: userId });
    const userName = user.name;

    const userWasReported = await usersCollection().find({
      _id: userId,
      'reportedBy._id': {
        $exists: true,
        $eq: authUserId,
      }
    }).count();

    if (userWasReported) {
      return res.status(200).send({
        message: `${userName} has already been reported`,
      });
    }

    const now = new Date();
    const local = now.toLocaleString();

    const reportedBy = {
      _id: authUserId,
      name: authUser.name,
      createdAt: now,
      local,
      resolved: false,
      reason,
    }

    if (additionalInformation.length > 0) {
      reportedBy['additionalInformation'] = additionalInformation;
    }

    await usersCollection().findOneAndUpdate({
      _id: userId,
    }, {
      $push: {
        reportedBy,
      },
    });

    return res.status(201).send({
      message: `${userName} has been reported`,
    });
  } catch (error) {
    returnServerError(res, error);
  }
})

module.exports = router;
