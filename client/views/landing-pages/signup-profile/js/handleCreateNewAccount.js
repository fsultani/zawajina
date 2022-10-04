let birthMonth;
let birthDay;
let birthYear;
let gender;
let religiousConviction;
let religiousValues;
let maritalStatus;
let education;
let profession;
let hijab;
let hasChildren;
let wantsChildren;
let height;
let canRelocate;
let diet;
let smokes;
let countryRaisedIn;

const handleBirthMonth = event => (birthMonth = event.target.value);
const handleBirthDay = event => (birthDay = event.target.value);
const handleBirthYear = event => (birthYear = event.target.value);
const handleGender = value => {
  if (value === 'female') {
    document.querySelector('.hijab-container').style.display = 'inline-block';
  } else {
    document.querySelector('.hijab-container').style.display = 'none';
  }
  return (gender = value);
};
const handleConviction = event => (religiousConviction = event.target.value);
const handleReligiousValues = event => (religiousValues = event.target.value);
const handleMaritalStatus = event => (maritalStatus = event.target.value);
const handleEducation = event => (education = event.target.value);
const handleProfession = event => (profession = event.target.value);
const handleHijab = value => (hijab = value);
const handleHasChildren = value => (hasChildren = value);
const handleWantsChildren = value => (wantsChildren = value);
const handleHeight = event => (height = Number(event.target.value));
const handleCanRelocate = event => (canRelocate = event.target.value);
const handleDiet = event => (diet = event.target.value);
const handleSmokes = value => (smokes = value);

const createNewAccountButton = document.querySelector('#createNewAccount');
const loadingSpinner = document.querySelector('.submit-loading-spinner');

const addErrorClass = element => document.querySelector(`${element}`).classList.add('form-error');
const removeErrorClass = element => document.querySelector(`${element}`).classList.remove('form-error');

const handleCreateNewAccount = async () => {
  const locationData = document.querySelector('#locationInput').dataset;
  const city = locationData.city;
  const state = locationData.state !== 'null' ? locationData.state : null;
  const country = locationData.country;

  const ethnicity = [];
  document.querySelectorAll('.user-ethnicity-content').forEach(({ id }) => {
    ethnicity.push(id);
  });

  const userCountryContent = document.querySelector('.user-country-content');

  const languages = [];
  document.querySelectorAll('.user-language-content').forEach(({ id }) => {
    languages.push(id);
  });

  const hobbies = [];
  document.querySelectorAll('.user-hobby-content').forEach(({ id }) => {
    hobbies.push(id);
  });

  if (!birthMonth) {
    addErrorClass('.dob-month');
  } else {
    removeErrorClass('.dob-month');
  }

  if (!birthDay) {
    addErrorClass('.dob-day');
  } else {
    removeErrorClass('.dob-day');
  }

  if (!birthYear) {
    addErrorClass('.dob-year');
  } else {
    removeErrorClass('.dob-year');
  }

  if (!gender) {
    addErrorClass('.form-flex');
  } else {
    removeErrorClass('.form-flex');
  }

  if (!city) {
    closeAllLists('#locationInput');
    document.querySelector('.user-location').style.cssText = 'padding-bottom: 4px';
    document.querySelector('#city-error').innerHTML = 'Please select your city from the dropdown';
    document.querySelector('#city-error').style.display = 'block';
  } else {
    document.querySelector('.user-location').style.cssText = 'padding-bottom: 16px';
    document.querySelector('#city-error').style.display = 'none';
  }

  if (!userCountryContent || userCountryContent.textContent === '') {
    closeAllLists('#countryRaisedInInput');
    document.querySelector('.country-user-raised-in').style.cssText = 'padding-bottom: 4px';
    document.querySelector('#country-raised-in-error').innerHTML =
      'Please select the country you raised in from the dropdown';
    document.querySelector('#country-raised-in-error').style.display = 'block';
  } else {
    document.querySelector('.country-user-raised-in').style.cssText = 'padding-bottom: 16px';
    document.querySelector('#country-raised-in-error').style.display = 'none';
    countryRaisedIn = userCountryContent.textContent;
  }

  if (ethnicity.length === 0) {
    closeAllLists('#ethnicityInput');
    document.querySelector('.user-ethnicity').style.cssText = 'padding-bottom: 4px';
    document.querySelector('#ethnicity-error').innerHTML =
      'Please select your ethnicity from the dropdown';
    document.querySelector('#ethnicity-error').style.display = 'block';
  } else {
    document.querySelector('.user-ethnicity').style.cssText = 'padding-bottom: 16px';
    document.querySelector('#ethnicity-error').style.display = 'none';
  }

  if (languages.length === 0) {
    closeAllLists('#languageInput');
    document.querySelector('.user-languages').style.cssText = 'padding-bottom: 4px';
    document.querySelector('#languages-error').innerHTML =
      'Please select your language from the dropdown';
    document.querySelector('#languages-error').style.display = 'block';
  } else {
    document.querySelector('.user-languages').style.cssText = 'padding-bottom: 16px';
    document.querySelector('#languages-error').style.display = 'none';
  }

  if (!religiousConviction) {
    addErrorClass('.religious-conviction');
  } else {
    removeErrorClass('.religious-conviction');
  }

  if (!religiousValues) {
    addErrorClass('.religious-values');
  } else {
    removeErrorClass('.religious-values');
  }

  if (!maritalStatus) {
    addErrorClass('.marital-status');
  } else {
    removeErrorClass('.marital-status');
  }

  if (!education) {
    addErrorClass('.education');
  } else {
    removeErrorClass('.education');
  }

  if (!profession) {
    addErrorClass('.professions');
  } else {
    removeErrorClass('.professions');
  }

  if (gender === 'female' && !hijab) {
    addErrorClass('.hijab');
  } else {
    removeErrorClass('.hijab');
  }

  if (!hasChildren) {
    addErrorClass('.has-children');
  } else {
    removeErrorClass('.has-children');
  }

  if (!wantsChildren) {
    addErrorClass('.wants-children');
  } else {
    removeErrorClass('.wants-children');
  }

  if (!height) {
    addErrorClass('.user-height');
  } else {
    removeErrorClass('.user-height');
  }

  if (!canRelocate) {
    addErrorClass('.can-relocate');
  } else {
    removeErrorClass('.can-relocate');
  }

  if (!diet) {
    addErrorClass('.diet');
  } else {
    removeErrorClass('.diet');
  }

  if (!smokes) {
    addErrorClass('.smokes');
  } else {
    removeErrorClass('.smokes');
  }

  const rawInput = string => string.split(' ').join('').toLowerCase().replace(/\./g, '').replace(/,/g, '')
  const socialMediaAccounts = [
    'facebook',
    'whatsapp',
    'googlehangouts',
    'instagram',
    'snapchat',
    'viber',
    'telegram',
    'kakaotalk',
    'kik',
    '@',
  ];
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '\n': '<br>',
  };
  const htmlEscapeRegex = /[&<>"'\/\n]/g;

  const textareaHasSocialMediaAccount = string => socialMediaAccounts.some(item => rawInput(string).includes(item));
  const textareaHasPhoneNumber = string => string.match(/\d{6,}/g);
  const handleHtmlEscape = string => '' + string.replace(htmlEscapeRegex, match => htmlEscapes[match]);

  const aboutMe = handleHtmlEscape(document.getElementById('about-me').value);
  let aboutMeIsValid = true;
  if (!aboutMe || aboutMe.length < 100) {
    addErrorClass('.about-me');
    document.querySelector('#about-me-error-text').innerHTML =
      'Please enter at least 100 characters';
    document.querySelector('#about-me-error-text').style.display = 'block';
    aboutMeIsValid = false;
  } else if (textareaHasSocialMediaAccount(aboutMe)) {
    addErrorClass('.about-me');
    document.querySelector('#about-me-error-text').innerHTML =
      'Email addresses and social media accounts are not allowed in your profile';
    document.querySelector('#about-me-error-text').style.display = 'block';
    aboutMeIsValid = false;
  } else if (textareaHasPhoneNumber(aboutMe)) {
    addErrorClass('.about-me');
    document.querySelector('#about-me-error-text').innerHTML =
      'Phone numbers are not allowed in your profile';
    document.querySelector('#about-me-error-text').style.display = 'block';
    aboutMeIsValid = false;
  } else {
    removeErrorClass('.about-me');
    document.querySelector('#about-me-error-text').style.display = 'none';
    aboutMeIsValid = true;
  }

  const aboutMyMatch = handleHtmlEscape(document.getElementById('about-my-match').value);
  let aboutMyMatchIsValid = true;
  if (!aboutMyMatch || aboutMyMatch.length < 100) {
    addErrorClass('.about-my-match');
    document.querySelector('#about-my-match-error-text').innerHTML =
      'Please enter at least 100 characters';
    document.querySelector('#about-my-match-error-text').style.display = 'block';
    aboutMyMatchIsValid = false;
  } else if (textareaHasSocialMediaAccount(aboutMyMatch)) {
    addErrorClass('.about-my-match');
    document.querySelector('#about-my-match-error-text').innerHTML =
      'Email addresses and social media accounts are not allowed in your profile';
    document.querySelector('#about-my-match-error-text').style.display = 'block';
    aboutMyMatchIsValid = false;
  } else if (textareaHasPhoneNumber(aboutMyMatch)) {
    addErrorClass('.about-my-match');
    document.querySelector('#about-my-match-error-text').innerHTML =
      'Phone numbers are not allowed in your profile';
    document.querySelector('#about-my-match-error-text').style.display = 'block';
    aboutMyMatchIsValid = false;
  } else {
    removeErrorClass('.about-my-match');
    document.querySelector('#about-my-match-error-text').style.display = 'none';
    aboutMyMatchIsValid = true;
  }

  if (
    birthMonth &&
    birthDay &&
    birthYear &&
    ((gender === 'male' && !hijab) || (gender === 'female' && hijab)) &&
    city &&
    ethnicity.length > 0 &&
    userCountryContent &&
    userCountryContent.textContent !== '' &&
    languages.length > 0 &&
    religiousConviction &&
    religiousValues &&
    maritalStatus &&
    education &&
    profession &&
    hasChildren &&
    wantsChildren &&
    height &&
    canRelocate &&
    diet &&
    smokes &&
    aboutMeIsValid &&
    aboutMyMatchIsValid
  ) {
    loadingSpinner.style.display = 'flex';
    createNewAccountButton.innerHTML = '';
    createNewAccountButton.disabled = true;
    createNewAccountButton.style.cursor = 'not-allowed';

    const userIPAddress = await getUserIPAddress();

    const userInfo = {
      birthMonth,
      birthDay,
      birthYear,
      gender,
      city,
      state,
      country,
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
      hobbies,
      aboutMe,
      aboutMyMatch,
      userIPAddress,
    };

    const images = document.forms.namedItem('signupForm');
    const userData = new FormData(images);
    userData.append('userInfo', JSON.stringify(userInfo));
    userData.append('userId', Cookies.get('my_match_userId'));

    document.querySelectorAll('form *').forEach(item => item.disabled = true);

    axios
      .post('/register/api/profile-details', userData)
      .then(res => {
        if (res.status === 201 || res.status === 200) {
          Cookies.set('my_match_authToken', res.data.token, { sameSite: 'strict' });
          Cookies.remove('my_match_userId');
          window.location.pathname = '/users';
        } else {
          document.querySelector('#application-error').style.display = 'block';
        }
      })
      .catch(error => {
        console.error('error.message:\n', error.message);

        loadingSpinner.style.display = 'none';
        createNewAccountButton.innerHTML = 'Create Account';
        createNewAccountButton.disabled = false;
        createNewAccountButton.style.cursor = 'pointer';

        document.querySelector('#application-error').style.display = 'block';
      });
  } else {
    document.querySelector('.form-errors').style.display = 'inline-block';
    addErrorClass('.signup-button');
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  }
};
