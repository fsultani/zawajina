const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

const { usersCollection } = require('../../db.js');
const { calculateImperialHeight, getLastActive } = require('./utils.js');
const { getAllFiles, redirectToLogin, camelCaseToTitleCase } = require('../../utils');

router.get('/:userId', async (req, res) => {
	try {
		const { authUser, allConversationsCount } = req;

		const userId = ObjectId(req.params.userId);
    const authUserId = ObjectId(authUser._id);
		let user;

		if (userId !== 'undefined') {
      const userDocumentResponse = await usersCollection().aggregate([
        {
          $match: {
            _id: userId
          }
        },
        {
          $addFields: {
            photos: {
              $filter: {
                input: '$photos',
                as: 'photo',
                cond: {
                  $and: [
                    {
                      $isNumber: '$$photo.index',
                    },
                    {
                      $eq: [{ $type: '$$photo.public_id' }, "string"]
                    },
                    {
                      $eq: [{ $type: '$$photo.secure_url' }, "string"]
                    },
                    {
                      $eq: ['$$photo.approvalStatus', 'Approved'],
                    }
                  ]
                }
              }
            },
          }
        },
      ]).toArray();

      user = userDocumentResponse[0];
		}

		if (!user) return res.redirect('/users');

		const imperialHeight = calculateImperialHeight(user.height);
		const userHeight = `${imperialHeight.heightInFeet}'${imperialHeight.heightInInches}" (${user.height} cm)`;

		const userIsLiked = !!await usersCollection().findOne({
			_id: ObjectId(authUser._id),
			usersLiked: {
				$in: [userId]
			}
		});

    const hijab = user.hijab ? camelCaseToTitleCase(user.hijab).split(' ')[1] : null;
    const hasChildren = camelCaseToTitleCase(user.hasChildren).split(' ')[2];
    const wantsChildren = camelCaseToTitleCase(user.wantsChildren).split(' ')[2];
    const canRelocate = camelCaseToTitleCase(user.canRelocate).split(' ').slice(2).map((word, index) => index > 0 ? word.toLowerCase() : word).join(', ');
    const smokes = camelCaseToTitleCase(user.smokes).split(' ')[1];

    user = {
      ...user,
      height: userHeight,
      userIsLiked,
      hasChildren,
      wantsChildren,
      canRelocate,
      smokes,
      hijab,
    };

    const lastActive = await getLastActive(userId);

    const userIsBlocked = !!await usersCollection().findOne({
      _id: authUserId,
      blockedUsers: {
        $in: [userId]
      }
    });

    const directoryPath = ['client/views/app/profile'];

    const stylesArray = [
			'/static/assets/styles/fontawesome-free-5.15.4-web/css/all.css',
			'/static/client/views/app/_partials/app-nav.css',
		];

    const scriptsArray = [
			'/static/assets/apis/axios.min.js',
			'/static/assets/apis/js.cookie.min.js',
		];

    const allStyles = getAllFiles({ directoryPath, fileType: 'css', filesArray: stylesArray });
    const scripts = getAllFiles({ directoryPath, fileType: 'js', filesArray: scriptsArray });

    const styles = allStyles.filter(item => !item.split('/').includes('modal'))

		res.render('app/_layouts/index', {
			locals: {
				title: 'My Match',
				styles,
				scripts,
				authUser,
				allConversationsCount,
				lastActive,
				user,
        userIsBlocked,
			},
			partials: {
				nav: 'app/_partials/app-nav',
				body: 'app/profile/index',
			},
		});
	} catch (error) {
    redirectToLogin(error, res);
	}
});

module.exports = router;
