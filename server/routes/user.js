const express = require('express');
const {
	ObjectId
} = require('mongodb');
const {
	compress
} = require('compress-images/promise');
const fs = require('fs');

const router = express.Router();

const upload = require('../helpers/multer');
const {
	usersCollection,
	insertLogs
} = require('../db.js');
const {
	getAllFiles
} = require('../utils')

const calculateImperialHeight = height => {
	const totalHeight = (height / 30.48).toString().split('.')
	const heightInFeet = totalHeight[0]
	const heightInInches = Math.round(Number(totalHeight[1].slice(0, 1)) * 12 * 0.1);

	return {
		heightInFeet,
		heightInInches,
	}
};

const uploadToCloudinary = async ({
	req,
	userId
}) => {
	try {
		const cloudinary = require('cloudinary');
		require('../config/cloudinary');

		let photos = [];
		const userImages = Object.values(req.files).map(async (image, _index) => {
			const file = image[0];
			const fileIndex = file.fieldname.split('-')[1];
			const result = await compress({
				source: file.path,
				destination: 'compressed/',
				enginesSetup: {
					jpg: {
						engine: 'mozjpeg',
						command: ['-quality', '60']
					},
					png: {
						engine: 'pngquant',
						command: ['--quality=20-50', '-o']
					},
				},
				params: {
					statistic: false,
				}
			});

			const {
				statistics,
				errors
			} = result;
			if (errors.length > 0) return new Error('Error in uploadToCloudinary');
			const upload = await cloudinary.v2.uploader.upload(statistics[0].path_out_new, {
				folder: userId,
			});

			const uploadResponse = {
				index: Number(fileIndex),
				asset_id: upload.asset_id,
				public_id: upload.public_id,
				version: upload.version,
				version_id: upload.version_id,
				signature: upload.signature,
				width: upload.width,
				height: upload.height,
				format: upload.format,
				resource_type: upload.resource_type,
				created_at: upload.created_at,
				tags: upload.tags,
				bytes: upload.bytes,
				type: upload.type,
				etag: upload.etag,
				placeholder: upload.placeholder,
				url: upload.url,
				secure_url: upload.secure_url,
				original_filename: upload.original_filename,
				api_key: upload.api_key,
			}

			photos.push({
				...uploadResponse
			});
		})

		await Promise.all(userImages);

		fs.readdirSync('uploads').forEach(f => fs.rmSync(`uploads/${f}`));
		fs.readdirSync('compressed').forEach(f => fs.rmSync(`compressed/${f}`));
		return photos;
	} catch (error) {
		console.error(`uploadToCloudinary error\n`, error);
		throw error;
	}
};

const deleteFromCloudinary = async ({
	publicIds
}) => {
	try {
		const cloudinary = require('cloudinary');
		require('../config/cloudinary');

		const response = await cloudinary.v2.api.delete_resources(publicIds, {
			invalidate: true
		});
		return response;
	} catch (error) {
		console.error(`uploadToCloudinary error\n`, error);
		throw error;
	}
};

const checkUserInfo = (userDocument, userInfo) => {
	const {
		city: newCity,
		state: newState,
		country: newCountry,
		languages: newLanguages,
		religiousConviction: newReligiousConviction,
		religiousValues: newReligiousValues,
		maritalStatus: newMaritalStatus,
		education: newEducation,
		profession: newProfession,
		canRelocate: newCanRelocate,
		diet: newDiet,
		smokes: newSmokes,
		hasChildren: newHasChildren,
		wantsChildren: newWantsChildren,
		hijab: newHijab,
		hobbies: newHobbies,
		aboutMe: newAboutMe,
		aboutMyMatch: newAboutMyMatch,
	} = userInfo;

	let updatedUserInfo = {
		...userDocument,
	}

	const currentCity = userDocument.city;
	const currentState = userDocument.state;
	const currentCountry = userDocument.country;

	const updateLocation = newCity?.length > 0 && (
		(currentCity !== newCity) ||
		(currentState !== newState) ||
		(currentCountry !== newCountry)
	);

	if (updateLocation) {
		updatedUserInfo = {
			city: newCity,
			state: newState,
			country: newCountry,
		}
	}

	if (newLanguages?.length > 0) {
		updatedUserInfo = {
			...updatedUserInfo,
			languages: [...newLanguages]
		}
	}

	if (newReligiousConviction) {
		updatedUserInfo = {
			...updatedUserInfo,
			religiousConviction: newReligiousConviction,
		}
	}

	if (newReligiousValues) {
		updatedUserInfo = {
			...updatedUserInfo,
			religiousValues: newReligiousValues,
		}
	}

	if (newMaritalStatus) {
		updatedUserInfo = {
			...updatedUserInfo,
			maritalStatus: newMaritalStatus,
		}
	}

	if (newEducation) {
		updatedUserInfo = {
			...updatedUserInfo,
			education: newEducation,
		}
	}

	if (newProfession) {
		updatedUserInfo = {
			...updatedUserInfo,
			profession: newProfession,
		}
	}

	if (newCanRelocate) {
		updatedUserInfo = {
			...updatedUserInfo,
			canRelocate: newCanRelocate,
		}
	}

	if (newDiet) {
		updatedUserInfo = {
			...updatedUserInfo,
			diet: newDiet,
		}
	}

	if (newSmokes) {
		updatedUserInfo = {
			...updatedUserInfo,
			smokes: newSmokes,
		}
	}

	if (newHasChildren) {
		updatedUserInfo = {
			...updatedUserInfo,
			hasChildren: newHasChildren,
		}
	}

	if (newWantsChildren) {
		updatedUserInfo = {
			...updatedUserInfo,
			wantsChildren: newWantsChildren,
		}
	}

	if (newHijab) {
		updatedUserInfo = {
			...updatedUserInfo,
			hijab: newHijab,
		}
	}

	if (newHobbies?.length > 0) {
		updatedUserInfo = {
			...updatedUserInfo,
			hobbies: [...newHobbies],
		}
	}

	if (newAboutMe) {
		updatedUserInfo = {
			...updatedUserInfo,
			aboutMe: newAboutMe,
		}
	}

	if (newAboutMyMatch) {
		updatedUserInfo = {
			...updatedUserInfo,
			aboutMyMatch: newAboutMyMatch,
		}
	}

	return updatedUserInfo;
}

router.get('/:userId', async (req, res) => {
	try {
		const {
			userId
		} = req.params;
		const {
			authUser,
			allConversationsCount
		} = req;
		let userDocument;

		if (userId !== 'undefined') {
			userDocument = await usersCollection().findOne({
				_id: ObjectId(userId)
			});
		}

		if (!userDocument) return res.redirect('/users');

		const imperialHeight = calculateImperialHeight(userDocument.height);
		const userHeight = `${imperialHeight.heightInFeet}'${imperialHeight.heightInInches}" (${userDocument.height} cm)`;

		const userIsLiked = !!await usersCollection().findOne({
			_id: ObjectId(authUser._id),
			usersLiked: {
				$in: [userId]
			}
		});

		const user = {
			...userDocument,
			height: userHeight,
			userIsLiked,
		};

		// const lastLogin = new Date(user.loginData[0]?.time);
		const lastLogin = new Date();
		const today = new Date();
		const minutesSinceLastLogin = Math.floor((today.getTime() - lastLogin.getTime()) / 1000 / 60);

		let lastActive;
		if (minutesSinceLastLogin === 0) {
			lastActive = 'Just now';
		} else if (minutesSinceLastLogin === 1) {
			lastActive = '1 minute ago';
		} else if (minutesSinceLastLogin > 1 && minutesSinceLastLogin < 60) {
			lastActive = `${minutesSinceLastLogin} minutes ago`;
		} else if (minutesSinceLastLogin >= 60 && minutesSinceLastLogin < 60 * 2) {
			lastActive = '1 hour ago';
		} else if (minutesSinceLastLogin >= 60 * 2 && minutesSinceLastLogin < 60 * 24) {
			lastActive = `${Math.floor(minutesSinceLastLogin / 60)} hours ago`;
		} else if (minutesSinceLastLogin >= 60 * 24 && minutesSinceLastLogin < 60 * 24 * 2) {
			lastActive = '1 day ago';
		} else if (minutesSinceLastLogin >= 60 * 24 * 2 && minutesSinceLastLogin < 60 * 24 * 30) {
			lastActive = `${Math.floor(minutesSinceLastLogin / 60 / 24)} days ago`;
		} else if (minutesSinceLastLogin >= 60 * 24 * 30 && minutesSinceLastLogin < 60 * 24 * 30 * 2) {
			lastActive = '1 month ago';
		} else if (
			minutesSinceLastLogin >= 60 * 24 * 30 * 2 &&
			minutesSinceLastLogin < 60 * 24 * 30 * 12
		) {
			lastActive = `${Math.floor(minutesSinceLastLogin / 60 / 24 / 30)} months ago`;
		} else {
			lastActive = '12+ months ago';
		}

		const stylesDirectoryPath = ['client/views/app/profile/css', 'client/views/app/profile/css/modal'];
		const scriptsDirectoryPath = ['client/views/app/profile/js', 'client/views/app/profile/js/helpers', 'client/views/app/profile/js/sections'];

		const styles = [
			'/static/assets/styles/fontawesome-free-5.15.4-web/css/all.css',
			'/static/client/views/app/_partials/app-nav.css',
		];

		const scripts = [
			'/static/assets/apis/axios.min.js',
			'/static/assets/apis/js.cookie.min.js',
			'/static/client/views/app/profile/js/main.js',
		];

		res.render('app/_layouts/index', {
			locals: {
				title: 'My Match',
				styles: getAllFiles({
					directoryPath: stylesDirectoryPath,
					fileType: 'css',
					filesArray: styles
				}),
				scripts: getAllFiles({
					directoryPath: scriptsDirectoryPath,
					fileType: 'js',
					filesArray: scripts
				}),
				authUser,
				allConversationsCount,
				lastActive,
				user,
			},
			partials: {
				nav: 'app/_partials/app-nav',
				body: 'app/profile/index',
			},
		});
	} catch (error) {
		console.log(`error\n`, error);
	}
});

router.get('/api/:userId', async (req, res) => {
	try {
		const {
			userId
		} = req.params;
		let userDocument;

		if (userId !== 'undefined') {
			userDocument = await usersCollection().findOne({
				_id: ObjectId(userId)
			});
		}

		if (!userDocument) return res.redirect('/users');

		const imperialHeight = calculateImperialHeight(userDocument.height);
		const userHeight = `${imperialHeight.heightInFeet}'${imperialHeight.heightInInches}" (${userDocument.height} cm)`;

		const authUser = {
			...userDocument,
			height: userHeight,
			lastActive: 'Just now',
		};

		res.status(200).json({
			authUser
		});
	} catch (error) {
		console.log(`error\n`, error);
	}
});

router.put(
	'/api/profile-details',
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
			const {
				authUser,
				userIPAddress,
				endpoint,
				userId
			} = req;

			let userDocument = await usersCollection().findOne({
				_id: ObjectId(userId)
			});
			userDocument = Object.keys(userDocument).filter(item => item !== 'loginData').reduce((obj, key) => {
				return Object.assign(obj, {
					[key]: userDocument[key]
				});
			}, {});

			const userInfo = JSON.parse(req.body.userInfo);
			let updatedUserInfo = checkUserInfo(userDocument, userInfo)

			let updatedPhotos = [...userDocument.photos]
			let publicIds = [];

			if (req.body.photos) {
				const photos = JSON.parse(req.body.photos);
				let newPhotos = photos.filter(photo => photo.image.startsWith('blob:'));
				if (newPhotos.length > 0) {
					const response = await uploadToCloudinary({
						req,
						userId: userId
					});
					updatedPhotos = [...updatedPhotos, ...response];
				}

				const deletedPhotos = photos.filter(photo => photo.image.split('/').indexOf('undefined') > -1)
				if (deletedPhotos.length > 0) {
					await Promise.all(deletedPhotos.map(async photo => {
						publicIds.push(userDocument.photos[photo.index].public_id)
						const remainingPhotos = updatedPhotos.filter(currentPhoto => currentPhoto.index !== photo.index)
						updatedPhotos = [...remainingPhotos];
					}))
					await deleteFromCloudinary({
						publicIds
					});
				}

				await Promise.all(photos.map(async photo => {
					if (userDocument.photos[photo.index] && photo.image !== userDocument.photos[photo.index].secure_url) {
						publicIds.push(userDocument.photos[photo.index].public_id)
						const remainingPhotos = updatedPhotos.filter(currentPhoto => currentPhoto.public_id !== userDocument.photos[photo.index].public_id)
						updatedPhotos = [...remainingPhotos];
						await deleteFromCloudinary({
							publicIds
						});
					}
				}))

				updatedPhotos.sort((a, b) => a.index - b.index);
				updatedPhotos = updatedPhotos.map((item, index) => ({
					...item,
					index,
				}));
			}

			updatedUserInfo = {
				...updatedUserInfo,
				photos: updatedPhotos,
			}

			usersCollection().findOneAndUpdate({
					_id: userId
				}, {
					$set: {
						...updatedUserInfo,
					},
				}, {
					returnDocument: 'after',
					returnNewDocument: true,
				},
				async (err, _user) => {
					if (err) {
						console.log(`err\n`, err);
						return res.send({
							error: err
						});
					}

					return res.status(200).json({
						response: updatedUserInfo
					});
				}
			);

			if (authUser.gender === 'male') {
				delete updatedUserInfo.hijab;
			}

			if (updatedUserInfo.country !== userDocument.country) {
				await insertLogs({
						city: updatedUserInfo.city,
						state: updatedUserInfo.state,
						country: updatedUserInfo.country,
					},
					userIPAddress,
					endpoint,
					userId
				);
			} else if (updatedUserInfo.state !== userDocument.state) {
				await insertLogs({
						city: updatedUserInfo.city,
						state: updatedUserInfo.state,
					},
					userIPAddress,
					endpoint,
					userId
				);
			} else if (updatedUserInfo.city !== userDocument.city) {
				await insertLogs({
						city: updatedUserInfo.city,
					},
					userIPAddress,
					endpoint,
					userId
				);
			}

			delete updatedUserInfo.photos;
			delete updatedUserInfo.city;
			delete updatedUserInfo.state;
			delete updatedUserInfo.country;

			Object.entries(updatedUserInfo).map(async ([key, value]) => {
				if (userDocument[key] !== value) {
					await insertLogs({
							[key]: value,
						},
						userIPAddress,
						endpoint,
						userId
					);
				}
			});
		} catch (error) {
			console.log(`profileDetails error\n`, error);
			res.send({
				error
			});
			throw error;
		}
	}
);

router.put(
	'/api/profile-details/photos',
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
			const {
				authUser,
				userIPAddress,
				endpoint,
				userId
			} = req;

			let userDocument = await usersCollection().findOne({
				_id: ObjectId(userId)
			});
			userDocument = Object.keys(userDocument).filter(item => item !== 'loginData').reduce((obj, key) => {
				return Object.assign(obj, {
					[key]: userDocument[key]
				});
			}, {});

			// const userInfo = JSON.parse(req.body.userInfo);
			// let updatedUserInfo = checkUserInfo(userDocument, userInfo)

			let updatedPhotos = [...userDocument.photos]
			let publicIds = [];

			if (req.body.photos) {
				const photos = JSON.parse(req.body.photos);
				const newPhotos = photos.filter(photo => photo.image.startsWith('blob:'));
				if (newPhotos.length > 0) {
					const response = await uploadToCloudinary({
						req,
						userId: userId
					});
					updatedPhotos = [...updatedPhotos, ...response];
				}

				const deletedPhotos = photos.filter(photo => photo.image.split('/').indexOf('deletePhoto') > -1)
				if (deletedPhotos.length > 0) {
					await Promise.all(deletedPhotos.map(async photo => {
						publicIds.push(userDocument.photos[photo.index].public_id)
						const remainingPhotos = updatedPhotos.filter(currentPhoto => currentPhoto.index !== photo.index)
						updatedPhotos = [...remainingPhotos];
					}))
					await deleteFromCloudinary({
						publicIds
					});
				}

				await Promise.all(photos.map(async photo => {
					if (userDocument.photos[photo.index] && photo.image !== userDocument.photos[photo.index].secure_url) {
						publicIds.push(userDocument.photos[photo.index].public_id)
						const remainingPhotos = updatedPhotos.filter(currentPhoto => currentPhoto.public_id !== userDocument.photos[photo.index].public_id)
						updatedPhotos = [...remainingPhotos];
						await deleteFromCloudinary({
							publicIds
						});
					}
				}))

				updatedPhotos.sort((a, b) => a.index - b.index);
				updatedPhotos = updatedPhotos.map((item, index) => ({
					...item,
					index,
				}));
			}

			userDocument = {
				...userDocument,
				photos: updatedPhotos,
			}

			usersCollection().updateOne({
					_id: userId
				}, {
					$set: {
						photos: updatedPhotos,
					},
				}, {
					returnDocument: 'after',
					returnNewDocument: true,
				},
				async (err, user) => {
					if (err) {
						console.log(`err\n`, err);
						return res.send({
							error: err
						});
					}

					return res.status(200).json({
						response: updatedPhotos
					});
				}
			);

			// if (authUser.gender === 'male') {
			//   delete updatedUserInfo.hijab;
			// }

			// if (updatedUserInfo.country !== userDocument.country) {
			//   await insertLogs({
			//     city: updatedUserInfo.city,
			//     state: updatedUserInfo.state,
			//     country: updatedUserInfo.country,
			//   },
			//     userIPAddress,
			//     endpoint,
			//     userId
			//   );
			// } else if (updatedUserInfo.state !== userDocument.state) {
			//   await insertLogs({
			//     city: updatedUserInfo.city,
			//     state: updatedUserInfo.state,
			//   },
			//     userIPAddress,
			//     endpoint,
			//     userId
			//   );
			// } else if (updatedUserInfo.city !== userDocument.city) {
			//   await insertLogs({
			//     city: updatedUserInfo.city,
			//   },
			//     userIPAddress,
			//     endpoint,
			//     userId
			//   );
			// }

			// delete updatedUserInfo.photos;
			// delete updatedUserInfo.city;
			// delete updatedUserInfo.state;
			// delete updatedUserInfo.country;

			// Object.entries(updatedUserInfo).map(async ([key, value]) => {
			//   if (userDocument[key] !== value) {
			//     await insertLogs({
			//       [key]: value,
			//     },
			//       userIPAddress,
			//       endpoint,
			//       userId
			//     );
			//   }
			// });
		} catch (error) {
			console.log(`profileDetails error\n`, error);
			res.send({
				error
			});
			throw error;
		}
	}
);

router.put('/like', async (req, res) => {
	const {
		authUser
	} = req;
	const {
		userId
	} = req.body;

	let userIsLiked = !!await usersCollection().findOne({
		_id: ObjectId(authUser._id),
		usersLiked: {
			$in: [userId]
		}
	});

	if (!userIsLiked) {
		await usersCollection().findOneAndUpdate({
				_id: ObjectId(userId)
			}, {
				$push: {
					likedByUsers: authUser._id.toString(),
				},
			},
			async (err, _user) => {
				if (err) {
					console.log(`err\n`, err);
					return res.send({
						error: err
					});
				}
			}
		);

		await usersCollection().findOneAndUpdate({
				_id: authUser._id
			}, {
				$push: {
					usersLiked: userId,
				},
			},
			async (err, _user) => {
				if (err) {
					console.log(`err\n`, err);
					return res.send({
						error: err
					});
				}

				const userLiked = await usersCollection().findOne({
					_id: ObjectId(userId)
				});
				return res.status(200).json({
					userIsLiked: true,
					userName: userLiked.name
				});
			}
		);
	} else {
		await usersCollection().findOneAndUpdate({
				_id: ObjectId(userId)
			}, {
				$pull: {
					likedByUsers: authUser._id.toString(),
				},
			},
			async (err, _user) => {
				if (err) {
					console.log(`err\n`, err);
					return res.send({
						error: err
					});
				}
			}
		);

		await usersCollection().findOneAndUpdate({
				_id: authUser._id
			}, {
				$pull: {
					usersLiked: userId,
				},
			},
			async (err, _user) => {
				if (err) {
					console.log(`err\n`, err);
					return res.send({
						error: err
					});
				}

				return res.status(200).json({
					userIsLiked: false
				});
			}
		);
	}
})

module.exports = router;
