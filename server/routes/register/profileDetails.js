const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex');

const { checkIPAddress } = require('../../middleware/checkAuthentication.js');
const { usersCollection, insertLogs, geoLocationData } = require('../../db.js');
const { uploadToCloudinary } = require('../../helpers/cloudinary.js');
const {
  inputHasSocialMediaAccount,
  inputHasPhoneNumber,
  invalidString,
  inputHasSocialMediaTag,
  preventWebLinks,
  escapeHtml,
  returnServerError,
  badRequest,
} = require('../../utils');

const locationsData = require('../../data/world-cities');
const allLocationsData = locationsData.default.getAllCities();

const ethnicitiesData = require('../../data/ethnicities');
const allEthnicitiesData = ethnicitiesData.default.getAllEthnicities();

const allCountriesData = locationsData.default.getAllCountries();

const languagesData = require('../../data/languages');
const allLanguagesData = languagesData.default.getAllLanguages();

const professionsData = require('../../data/professionsList');

const heightsData = require('../../data/heights');

const hobbiesData = require('../../data/hobbies');
const allHobbiesData = hobbiesData.default.getAllHobbies();

const profileDetails = async (req, res) => {
  try {
    const { userId } = req.body;
    const { userIPAddress } = await checkIPAddress(req);
    let {
      birthMonth,
      birthDay,
      birthYear,
      gender,
      country,
      state,
      city,
      ethnicity,
      countryRaisedIn,
      languages,
      religiousConviction,
      religiousValues,
      maritalStatus,
      education,
      profession,
      hijab,
      hasChildren,
      wantsChildren,
      height,
      canRelocate,
      diet,
      smokes,
      prayerLevel,
      hobbies,
      aboutMe,
      aboutMyMatch,
    } = JSON.parse(req.body.userInfo);

    const now = new Date();

    const fullDob = `${birthMonth}/${birthDay}/${birthYear}`;
    const isValidDob = Date.parse(fullDob);
    const isFutureDate = (now - isValidDob) < 0;
    if (!isValidDob || isFutureDate) return badRequest(res, 'Invalid dob-month');

    const fullDobDateObject = new Date(fullDob);

    /* Calculate the number of months from the birth month to the current month */
    const differenceInMonths = Date.now() - fullDobDateObject.getTime();

    /* Convert differenceInMonths to the Date format */
    const ageDateObject = new Date(differenceInMonths);

    /* Get the year from the converted date */
    const year = ageDateObject.getUTCFullYear();

    /* Calculate the age of the user */
    const age = Math.abs(year - 1970);
    if (age < 18) return badRequest(res, 'Invalid dob-year');

    if (!(gender === 'male' || gender === 'female')) return badRequest(res, 'Invalid gender');

    const validLocation = allLocationsData.findIndex(location => location.city === city && location.state === state && location.country === country) > -1;
    if (!validLocation) return badRequest(res, 'Invalid user-location');

    const validEthnicity = ethnicity.every(element => allEthnicitiesData.indexOf(element) > -1);
    if (!validEthnicity) return badRequest(res, 'Invalid ethnicity');

    const validCountryRaisedIn = allCountriesData.findIndex(countryObject => countryObject.country === countryRaisedIn) > -1;
    if (!validCountryRaisedIn) return badRequest(res, 'Invalid country-user-raised-in');

    const validLanguages = languages.every(element => allLanguagesData.indexOf(element) > -1);
    if (!validLanguages) return badRequest(res, 'Invalid language');

    const religiousConvictionOptions = [
      'Sunni',
      'Shia',
      'Just Muslim',
      'Other',
    ]
    const validReligiousConviction = religiousConvictionOptions.indexOf(religiousConviction) > -1;
    if (!validReligiousConviction) return badRequest(res, 'Invalid religious-conviction');

    const religiousValuesOptions = [
      'Conservative',
      'Moderate',
      'Liberal',
    ]
    const validReligiousValues = religiousValuesOptions.indexOf(religiousValues) > -1;
    if (!validReligiousValues) return badRequest(res, 'Invalid religious-values');

    const maritalStatusOptions = [
      'Never Married',
      'Divorced',
      'Widowed',
    ]
    const validMaritalStatus = maritalStatusOptions.indexOf(maritalStatus) > -1;
    if (!validMaritalStatus) return badRequest(res, 'Invalid marital-status');

    const educationOptions = [
      'High School',
      'Associate degree',
      'Bachelor\'s degree',
      'Master\'s degree',
      'Doctoral degree',
    ]
    const validEducation = educationOptions.indexOf(education) > -1;
    if (!validEducation) return badRequest(res, 'Invalid education');

    const validProfession = professionsData.indexOf(profession) > -1;
    if (!validProfession) return badRequest(res, 'Invalid dob-month');

    if (gender === 'female' && !(hijab === 'hijabYes' || hijab === 'hijabNo')) return badRequest(res, 'Invalid hijab');
    if (gender !== 'female' && hijab) return badRequest(res, 'Invalid hijab');

    if (!(hasChildren === 'hasChildrenYes' || hasChildren === 'hasChildrenNo')) return badRequest(res, 'Invalid has-children');

    const wantsChildrenOptions = [
      'wantsChildrenYes',
      'wantsChildrenNo',
      'wantsChildrenMaybe',
    ]
    const validWantsChildren = wantsChildrenOptions.indexOf(wantsChildren) > -1;
    if (!validWantsChildren) return badRequest(res, 'Invalid wants-children');

    const validHeight = heightsData.indexOf(height) > -1;
    if (!validHeight) return badRequest(res, 'Invalid height');

    const canRelocateOptions = [
      'canRelocateYes',
      'canRelocateNo',
      'canRelocateMaybe',
    ]
    const validCanRelocate = canRelocateOptions.indexOf(canRelocate) > -1;
    if (!validCanRelocate) return badRequest(res, 'Invalid can-relocate');

    const dietOptions = [
      'Halal only',
      'Halal when possible',
      'Eat anything',
      'Eat anything except pork',
      'Vegetarian',
    ]
    const validDiet = dietOptions.indexOf(diet) > -1;
    if (!validDiet) return badRequest(res, 'Invalid diet');

    if (!(smokes === 'smokesYes' || smokes === 'smokesNo')) return badRequest(res, 'Invalid smokes');

    const prayerLevelOptions = [
      'Rarely',
      'Sometimes',
      'Always',
    ]
    const validPrayerLevel = prayerLevelOptions.indexOf(prayerLevel) > -1;
    if (!validPrayerLevel) return badRequest(res, 'Invalid prayerLevel');

    const validHobbies = hobbies.every(element => allHobbiesData.indexOf(element) > -1);
    if (!validHobbies) return badRequest(res, 'Invalid hobbies');

    const invalidInput = string => (
      !string ||
      string.length < 100 ||
      inputHasSocialMediaAccount(string) ||
      inputHasSocialMediaTag(string) ||
      inputHasPhoneNumber(string) ||
      invalidString(string) ||
      preventWebLinks(string)
    )

    if (invalidInput(aboutMe)) return badRequest(res, 'Invalid about-me');
    aboutMe = escapeHtml(aboutMe).trim();

    if (invalidInput(aboutMyMatch)) return badRequest(res, 'Invalid about-my-match');
    aboutMyMatch = escapeHtml(aboutMyMatch).trim();

    let photos = [];
    
    if (req.files && Object.values(req.files).length > 0) {
      const response = await uploadToCloudinary({ req, userId });
      response.sort((a, b) => a.index - b.index);
      photos = [...response];
    }

    const locationData = await geoLocationData(userIPAddress);

    const blockedUsers = [];

    const _account = {
      user: {
        accountStatus: 'active',
        local: now.toLocaleString(),
        utc: now,
        ...locationData,
      },
      admin: {
        accountStatus: 'approved',
        notes: '',
        userFacingMessage: '',
      },
    };

    const userObject = {
      fullDob,
      age,
      gender,
      country,
      state,
      city,
      photos,
      ethnicity,
      countryRaisedIn,
      languages,
      religiousConviction,
      religiousValues,
      maritalStatus,
      education,
      profession,
      hijab,
      hasChildren,
      wantsChildren,
      height,
      canRelocate,
      diet,
      smokes,
      prayerLevel,
      hobbies,
      aboutMe,
      aboutMyMatch,
      blockedUsers,
      likedByUsers: [],
      usersLiked: [],
      _account,
      strikes: [],
    }

    const searchOptions = {
      data: {
        _id: {
          $nin: blockedUsers,
        },
        gender: gender === 'male' ? 'female' : 'male',
        '_account.user.accountStatus': 'active',
        '_account.admin.accountStatus': 'approved',
        languages: { $in: [] },
        profession: { $in: [] },
        hobbies: { $in: [] },
        maritalStatus: { $in: [] },
        religiousConviction: { $in: [] },
        religiousValues: { $in: [] },
        education: { $in: [] },
        hasChildren: 'hasChildrenDoesNotMatter',
        wantsChildren: 'wantsChildrenDoesNotMatter',
        hijab: 'hijabDoesNotMatter',
        canRelocate: 'canRelocateDoesNotMatter',
        smokes: 'smokesDoesNotMatter',
        ethnicity: { $in: [] },
        diet: { $in: [] },
        age: {
          $exists: true,
        },
        height: {
          $exists: true,
        },
        prayerLevel: { $in: [] },
        photos: false,
      },
      sortResults: 'lastActive',
    };

    usersCollection().findOneAndUpdate(
      { _id: ObjectId(userId) },
      {
        $set: {
          ...userObject,
          searchOptions,
          completedRegistrationAt: now,
        },
      },
      { new: true },
      async (_, user) => {
        const endpoint = req.originalUrl;
        await insertLogs({
          ...userObject,
        },
          userIPAddress,
          endpoint,
          userId
        );

        const token = jwt.sign({ my_match_userId: user.value._id }, JWT_SECRET, {
          expiresIn: '1 day',
        });
        res.status(201).send({ token, url: '/search' });
      }
    );
  } catch (error) {
    returnServerError(res, error);
  }
};

module.exports = profileDetails;
