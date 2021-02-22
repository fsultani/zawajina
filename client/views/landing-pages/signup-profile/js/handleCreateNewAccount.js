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

const handleBirthMonth = event => (birthMonth = event.target.value);
const handleBirthDay = event => (birthDay = event.target.value);
const handleBirthYear = event => (birthYear = event.target.value);
const handleGender = value => {
  if (value === 'female') {
    document.querySelector('.hijab-container').style.display = 'inline-block';
  } else {
    document.querySelector('.hijab-container').style.display = 'none';
  }
  return gender = value;
}
const handleConviction = event => religiousConviction = event.target.value;
const handleReligiousValues = event => religiousValues = event.target.value;
const handleMaritalStatus = event => maritalStatus = event.target.value;
const handleEducation = event => education = event.target.value;
const handleProfession = event => profession = event.target.value;
const handleHijab = value => (hijab = value);

const createNewAccountButton = document.querySelector('#createNewAccount');
const loadingSpinner = document.querySelector('.submit-loading-spinner');

const handleCreateNewAccount = () => {
  const locationData = document.querySelector('#locationInput').dataset;
  const city = locationData.city;
  const state = locationData.state;
  const country = locationData.country;

  const ethnicity = [];
  document.querySelectorAll('.user-ethnicity-content').forEach(({ id }) => {
    ethnicity.push(id);
  });

  const countryRaisedIn = document.querySelector('.user-country-content');

  const languages = [];
  document.querySelectorAll('.user-language-content').forEach(({ id }) => {
    languages.push(id);
  });

  const addErrorClass = element => document.querySelector(`${element}`).classList.add('form-error');
  const removeErrorClass = element =>
    document.querySelector(`${element}`).classList.remove('form-error');

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

  if (!countryRaisedIn || countryRaisedIn.textContent === '') {
    closeAllLists('#raisedInput');
    document.querySelector('.user-raised').style.cssText = 'padding-bottom: 4px';
    document.querySelector('#raised-error').innerHTML =
      'Please select the country you raised in from the dropdown';
    document.querySelector('#raised-error').style.display = 'block';
  } else {
    document.querySelector('.user-raised').style.cssText = 'padding-bottom: 16px';
    document.querySelector('#raised-error').style.display = 'none';
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
    addErrorClass('.religious-conviction-error')
  } else {
    removeErrorClass('.religious-conviction-error')
  }

  if (!religiousValues) {
    addErrorClass('.religious-values-error')
  } else {
    removeErrorClass('.religious-values-error')
  }

  if (!maritalStatus) {
    addErrorClass('.marital-status-error')
  } else {
    removeErrorClass('.marital-status-error')
  }

  if (!education) {
    addErrorClass('.education-error')
  } else {
    removeErrorClass('.education-error')
  }

  if (!profession) {
    addErrorClass('.profession-error')
  } else {
    removeErrorClass('.profession-error')
  }

  if (gender === 'female' && !hijab) {
    addErrorClass('.hijab-error');
  } else {
    removeErrorClass('.hijab-error');
  }

  if (
    birthMonth &&
    birthDay &&
    birthYear &&
    ((gender === 'male' && !hijab) || (gender === 'female' && hijab)) &&
    city &&
    ethnicity.length > 0 &&
    countryRaisedIn &&
    countryRaisedIn.textContent !== '' &&
    languages.length > 0 &&
    religiousConviction &&
    religiousValues &&
    maritalStatus &&
    education &&
    profession
  ) {
    loadingSpinner.style.display = 'flex';
    createNewAccountButton.innerHTML = '';
    createNewAccountButton.disabled = true;
    createNewAccountButton.style.cursor = 'not-allowed';

    const userInfo = {
      birthMonth,
      birthDay,
      birthYear,
      gender,
      city,
      state,
      country,
      ethnicity,
      countryRaisedIn: countryRaisedIn.textContent,
      languages,
      religiousConviction,
      religiousValues,
      maritalStatus,
      education,
      profession,
      hijab,
    };

    const images = document.forms.namedItem('signupForm');
    const userData = new FormData(images);
    userData.append('userInfo', JSON.stringify(userInfo));
    userData.append('userId', Cookies.get('userId'));

    axios
      .post('/register/api/about', userData)
      .then(res => {
        if (res.status === 201 || res.status === 200) {
          Cookies.set('token', res.data.token, { sameSite: 'strict' });
          Cookies.remove('userId');
          window.location.pathname = '/users';
        } else {
          document.querySelector('#signup-error').innerHTML =
            'Unknown error.  Please try again later.';
          document.querySelector('#signup-error').style.display = 'block';
        }
      })
      .catch(error => {
        console.error('error.message:\n', error.message);

        loadingSpinner.style.display = 'none';
        createNewAccountButton.innerHTML = 'Create Account';
        createNewAccountButton.disabled = false;
        createNewAccountButton.style.cursor = 'pointer';

        document.querySelector('#signup-error').innerHTML =
          'Unknown error.  Please try again later.';
        document.querySelector('#signup-error').style.display = 'block';
      });
  }
};
