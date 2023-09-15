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
let prayerLevel;
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
const handleHijab = event => (hijab = event.target.value);
const handleHasChildren = event => (hasChildren = event.target.value);
const handleWantsChildren = event => (wantsChildren = event.target.value);
const handleHeight = event => (height = Number(event.target.value));
const handleCanRelocate = event => (canRelocate = event.target.value);
const handleDiet = event => (diet = event.target.value);
const handleSmokes = event => (smokes = event.target.value);
const handlePrayerLevel = event => (prayerLevel = event.target.value);

const createNewAccountButton = document.querySelector('#createNewAccount');
const loadingSpinner = document.querySelector('.submit-loading-spinner');

const handleCreateNewAccount = async () => {
  let formFields = {}

  const locationData = document.querySelector('#locationInput').dataset;
  const city = locationData.city;
  const state = locationData.state === 'null' ? null : locationData.state;
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
  document.querySelectorAll('.hobbies-input').forEach(checkbox => {
    if (checkbox.checked) hobbies.push(checkbox.id);
  });

  if (!birthMonth || birthMonth === 'Select Month') {
    addErrorClass('#dob-month');
    formFields['birthMonth'] = false;
  } else {
    removeErrorClass('#dob-month');
    formFields['birthMonth'] = true;
  }

  if (!birthDay || birthDay === 'Select Day') {
    addErrorClass('#dob-day');
    formFields['birthDay'] = false;
  } else {
    removeErrorClass('#dob-day');
    formFields['birthDay'] = true;
  }

  if (!birthYear || birthYear === 'Select Year') {
    addErrorClass('#dob-year');
    formFields['birthYear'] = false;
  } else {
    removeErrorClass('#dob-year');
    formFields['birthYear'] = true;
  }

  if (!gender) {
    addErrorClass('#gender');
    formFields['gender'] = false;
  } else {
    removeErrorClass('#gender');
    formFields['gender'] = true;
  }

  if (!city) {
    closeAllLists('#locationInput');
    document.querySelector('.user-location').style.cssText = 'padding-bottom: 4px';
    document.querySelector('#city').innerHTML = 'Please select your city from the dropdown';
    document.querySelector('#city').style.display = 'block';
    formFields['city'] = false;
  } else {
    document.querySelector('.user-location').style.cssText = 'padding-bottom: 16px';
    document.querySelector('#city').style.display = 'none';
    formFields['city'] = true;
  }

  if (!userCountryContent || userCountryContent.textContent === '') {
    closeAllLists('#countryRaisedInInput');
    document.querySelector('.country-user-raised-in').style.cssText = 'padding-bottom: 4px';
    document.querySelector('#country-raised-in').innerHTML =
      'Please select the country you were raised in from the dropdown';
    document.querySelector('#country-raised-in').style.display = 'block';
    formFields['userCountryContent'] = false;
  } else {
    document.querySelector('.country-user-raised-in').style.cssText = 'padding-bottom: 16px';
    document.querySelector('#country-raised-in').style.display = 'none';
    countryRaisedIn = userCountryContent.textContent;
    formFields['userCountryContent'] = true;
  }

  if (ethnicity.length === 0) {
    closeAllLists('#ethnicityInput');
    document.querySelector('.user-ethnicity').style.cssText = 'padding-bottom: 4px';
    document.querySelector('#ethnicity').innerHTML =
      'Please select your ethnicity from the dropdown';
    document.querySelector('#ethnicity').style.display = 'block';
    formFields['ethnicity'] = false;
  } else {
    document.querySelector('.user-ethnicity').style.cssText = 'padding-bottom: 16px';
    document.querySelector('#ethnicity').style.display = 'none';
    formFields['ethnicity'] = true;
  }

  if (languages.length === 0) {
    closeAllLists('#languageInput');
    document.querySelector('.user-languages').style.cssText = 'padding-bottom: 4px';
    document.querySelector('#languages').innerHTML =
      'Please select your language(s) from the dropdown';
    document.querySelector('#languages').style.display = 'block';
    formFields['languages'] = false;
  } else {
    document.querySelector('.user-languages').style.cssText = 'padding-bottom: 16px';
    document.querySelector('#languages').style.display = 'none';
    formFields['languages'] = true;
  }

  if (!religiousConviction || religiousConviction === 'Select Conviction') {
    addErrorClass('#religious-conviction');
    formFields['religiousConviction'] = false;
  } else {
    removeErrorClass('#religious-conviction');
    formFields['religiousConviction'] = true;
  }

  if (!religiousValues || religiousValues === 'Select Values') {
    addErrorClass('#religious-values');
    formFields['religiousValues'] = false;
  } else {
    removeErrorClass('#religious-values');
    formFields['religiousValues'] = true;
  }

  if (!maritalStatus || maritalStatus === 'Select Marital Status') {
    addErrorClass('#marital-status');
    formFields['maritalStatus'] = false;
  } else {
    removeErrorClass('#marital-status');
    formFields['maritalStatus'] = true;
  }

  if (!education || education === 'Select Education Level') {
    addErrorClass('#education');
    formFields['education'] = false;
  } else {
    removeErrorClass('#education');
    formFields['education'] = true;
  }

  if (!profession || profession === 'Select Profession') {
    addErrorClass('#profession');
    formFields['profession'] = false;
  } else {
    removeErrorClass('#profession');
    formFields['profession'] = true;
  }

  if (gender === 'female' && !hijab) {
    addErrorClass('#hijab');
    formFields['gender'] = false;
  } else {
    removeErrorClass('#hijab');
    formFields['gender'] = true;
  }

  if (!hasChildren || hasChildren === 'Select One') {
    addErrorClass('#has-children');
    formFields['hasChildren'] = false;
  } else {
    removeErrorClass('#has-children');
    formFields['hasChildren'] = true;
  }

  if (!wantsChildren || wantsChildren === 'Select One') {
    addErrorClass('#wants-children');
    formFields['wantsChildren'] = false;
  } else {
    removeErrorClass('#wants-children');
    formFields['wantsChildren'] = true;
  }

  if (!height || height === 'Select Height') {
    addErrorClass('#user-height');
    formFields['height'] = false;
  } else {
    removeErrorClass('#user-height');
    formFields['height'] = true;
  }

  if (!canRelocate || canRelocate === 'Select One') {
    addErrorClass('#can-relocate');
    formFields['canRelocate'] = false;
  } else {
    removeErrorClass('#can-relocate');
    formFields['canRelocate'] = true;
  }

  if (!diet || diet === 'Select Diet') {
    addErrorClass('#diet');
    formFields['diet'] = false;
  } else {
    removeErrorClass('#diet');
    formFields['diet'] = true;
  }

  if (!smokes || smokes === 'Select One') {
    addErrorClass('#smokes');
    formFields['smokes'] = false;
  } else {
    removeErrorClass('#smokes');
    formFields['smokes'] = true;
  }

  if (!prayerLevel || prayerLevel === 'Select One') {
    addErrorClass('#prayer-level');
    formFields['prayerLevel'] = false;
  } else {
    removeErrorClass('#prayer-level');
    formFields['prayerLevel'] = true;
  }

  const aboutMeValue = document.getElementById('about-me').value;
  if (!aboutMeValue || aboutMeValue.length < 100) {
    addErrorClass('.about-me');
    document.querySelector('#about-me-error-text').innerHTML =
      'Please enter at least 100 characters';
    document.querySelector('#about-me-error-text').style.display = 'block';
    formFields['aboutMeValue'] = false;
  } else if (inputHasSocialMediaAccount(aboutMeValue) || inputHasSocialMediaTag(aboutMeValue)) {
    addErrorClass('.about-me');
    document.querySelector('#about-me-error-text').innerHTML =
      'No email or social media accounts allowed';
    document.querySelector('#about-me-error-text').style.display = 'block';
    formFields['aboutMeValue'] = false;
  } else if (inputHasPhoneNumber(aboutMeValue)) {
    addErrorClass('.about-me');
    document.querySelector('#about-me-error-text').innerHTML =
      'Phone numbers are not allowed';
    document.querySelector('#about-me-error-text').style.display = 'block';
    formFields['aboutMeValue'] = false;
  } else if (invalidString(aboutMeValue)) {
    addErrorClass('.about-me');
    document.querySelector('#about-me-error-text').innerHTML =
      'Special characters are not allowed';
    document.querySelector('#about-me-error-text').style.display = 'block';
    formFields['aboutMeValue'] = false;
  } else if (preventWebLinks(aboutMeValue)) {
    addErrorClass('.about-me');
    document.querySelector('#about-me-error-text').innerHTML =
      'Web links are not allowed';
    document.querySelector('#about-me-error-text').style.display = 'block';
    formFields['aboutMeValue'] = false;
  } else {
    removeErrorClass('.about-me');
    document.querySelector('#about-me-error-text').style.display = 'none';
    formFields['aboutMeValue'] = true;
  }

  const aboutMyMatchValue = document.getElementById('about-my-match').value;
  if (!aboutMyMatchValue || aboutMyMatchValue.length < 100) {
    addErrorClass('.about-my-match');
    document.querySelector('#about-my-match-error-text').innerHTML =
      'Please enter at least 100 characters';
    document.querySelector('#about-my-match-error-text').style.display = 'block';
    formFields['aboutMyMatchValue'] = false;
  } else if (inputHasSocialMediaAccount(aboutMyMatchValue) || inputHasSocialMediaTag(aboutMyMatchValue)) {
    addErrorClass('.about-my-match');
    document.querySelector('#about-my-match-error-text').innerHTML =
      'Email addresses and social media accounts are not allowed';
    document.querySelector('#about-my-match-error-text').style.display = 'block';
    formFields['aboutMyMatchValue'] = false;
  } else if (inputHasPhoneNumber(aboutMyMatchValue)) {
    addErrorClass('.about-my-match');
    document.querySelector('#about-my-match-error-text').innerHTML =
      'Phone numbers are not allowed';
    document.querySelector('#about-my-match-error-text').style.display = 'block';
    formFields['aboutMyMatchValue'] = false;
  } else if (invalidString(aboutMyMatchValue)) {
    addErrorClass('.about-my-match');
    document.querySelector('#about-my-match-error-text').innerHTML =
      'Special characters are not allowed';
    document.querySelector('#about-my-match-error-text').style.display = 'block';
    formFields['aboutMyMatchValue'] = false;
  } else if (preventWebLinks(aboutMyMatchValue)) {
    addErrorClass('.about-my-match');
    document.querySelector('#about-my-match-error-text').innerHTML =
      'Web links are not allowed';
    document.querySelector('#about-my-match-error-text').style.display = 'block';
    formFields['aboutMyMatchValue'] = false;
  } else {
    removeErrorClass('.about-my-match');
    document.querySelector('#about-my-match-error-text').style.display = 'none';
    formFields['aboutMyMatchValue'] = true;
  }

  if (Object.values(formFields).every(entry => entry)) {
    loadingSpinner.style.display = 'flex';
    createNewAccountButton.innerHTML = '';
    createNewAccountButton.disabled = true;
    createNewAccountButton.style.cursor = 'not-allowed';

    const aboutMe = document.getElementById('about-me').value;
    const aboutMyMatch = document.getElementById('about-my-match').value;

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
      prayerLevel,
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

    Axios({
      method: 'post',
      apiUrl: '/api/register/profile-details', // server/routes/register/profileDetails.js
      params: userData,
    })
      .then(res => {
        const { token, url } = res.data;
        Cookies.set('my_match_authToken', token, { sameSite: 'strict' });
        Cookies.remove('my_match_userId');
        window.location.pathname = url;
      })
      .catch(error => {
        document.querySelectorAll('form *').forEach(item => item.disabled = false);

        loadingSpinner.style.display = 'none';
        createNewAccountButton.innerHTML = 'Create Account';
        createNewAccountButton.disabled = false;
        createNewAccountButton.style.cursor = 'pointer';

        if (error.response?.data) {
          const elementError = error.response.data.message?.split(' ')[1];
          addErrorClass(`.${elementError}`);

          document.querySelector('.form-errors').style.display = 'inline-block';
          addErrorClass('#signup-button-error');
        } else {
          document.querySelector('#application-error').style.display = 'flex';
        }

        window.scroll({
          top: 0,
          behavior: 'smooth',
        });
      });
  } else {
    document.querySelector('.form-errors').style.display = 'inline-block';
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  }
};
