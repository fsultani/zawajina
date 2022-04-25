const addErrorClass = element => document.querySelector(`${element}`).classList.add('form-error');
const removeErrorClass = element => document.querySelector(`${element}`).classList.remove('form-error');
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

const handleSaveProfileChanges = async () => {
  languages = [];
  hobbies = [];

  locationData = document.querySelector('#locationInput').dataset;
  const city = locationData.city;
  const state = locationData.state !== 'null' ? locationData.state : null;
  const country = locationData.country;

  document.querySelectorAll('.user-language-content').forEach(({ id }) => {
    languages.push(id);
  });

  document.querySelectorAll('.user-hobby-content').forEach(({ id }) => {
    hobbies.push(id);
  });

  if (!city) {
    closeAllLists('#locationInput');
    document.querySelector('.user-location').style.cssText = 'padding-bottom: 4px';
    document.querySelector('#city-error').innerHTML = 'Please select your city from the dropdown';
    document.querySelector('#city-error').style.display = 'block';
  } else {
    document.querySelector('#city-error').style.display = 'none';
  }

  if (languages.length === 0) {
    closeAllLists('#languageInput');
    document.querySelector('.user-languages').style.cssText = 'padding-bottom: 4px';
    document.querySelector('#languages-error').innerHTML =
      'Please select your language from the dropdown';
    document.querySelector('#languages-error').style.display = 'block';
  } else {
    document.querySelector('#languages-error').style.display = 'none';
  }

  if (!religiousConviction) {
    addErrorClass('.religious-conviction-error');
  } else {
    removeErrorClass('.religious-conviction-error');
  }

  if (!religiousValues) {
    addErrorClass('.religious-values-error');
  } else {
    removeErrorClass('.religious-values-error');
  }

  if (!maritalStatus) {
    addErrorClass('.marital-status-error');
  } else {
    removeErrorClass('.marital-status-error');
  }

  if (!education) {
    addErrorClass('.education-error');
  } else {
    removeErrorClass('.education-error');
  }

  if (!profession) {
    addErrorClass('.profession-error');
  } else {
    removeErrorClass('.profession-error');
  }

  if (!relocate) {
    addErrorClass('.relocate-error');
  } else {
    removeErrorClass('.relocate-error');
  }

  if (!diet) {
    addErrorClass('.diet-error');
  } else {
    removeErrorClass('.diet-error');
  }

  if (!smokes) {
    addErrorClass('.smokes-error');
  } else {
    removeErrorClass('.smokes-error');
  }

  if (!hasChildren) {
    addErrorClass('.has-children-error');
  } else {
    removeErrorClass('.has-children-error');
  }

  if (!wantsChildren) {
    addErrorClass('.wants-children-error');
  } else {
    removeErrorClass('.wants-children-error');
  }

  if (!hijab) {
    addErrorClass('.hijab-error');
  } else {
    removeErrorClass('.hijab-error');
  }

  const aboutMe = handleHtmlEscape(document.getElementById('about-me').value);
  let aboutMeIsValid = true;
  if (!aboutMe || aboutMe.length < 100) {
    addErrorClass('.about-me-error');
    document.querySelector('#about-me-error-text').innerHTML =
      'Please enter at least 100 characters';
    document.querySelector('#about-me-error-text').style.display = 'block';
    aboutMeIsValid = false;
  } else if (textareaHasSocialMediaAccount(aboutMe)) {
    addErrorClass('.about-me-error');
    document.querySelector('#about-me-error-text').innerHTML =
      'Email addresses and social media accounts are not allowed in your profile';
    document.querySelector('#about-me-error-text').style.display = 'block';
    aboutMeIsValid = false;
  } else if (textareaHasPhoneNumber(aboutMe)) {
    addErrorClass('.about-me-error');
    document.querySelector('#about-me-error-text').innerHTML =
      'Phone numbers are not allowed in your profile';
    document.querySelector('#about-me-error-text').style.display = 'block';
    aboutMeIsValid = false;
  } else {
    removeErrorClass('.about-me-error');
    document.querySelector('#about-me-error-text').style.display = 'none';
    aboutMeIsValid = true;
  }

  const aboutMyMatch = handleHtmlEscape(document.getElementById('about-my-match').value);
  let aboutMyMatchIsValid = true;
  if (!aboutMyMatch || aboutMyMatch.length < 100) {
    addErrorClass('.about-my-match-error');
    document.querySelector('#about-my-match-error-text').innerHTML =
      'Please enter at least 100 characters';
    document.querySelector('#about-my-match-error-text').style.display = 'block';
    aboutMyMatchIsValid = false;
  } else if (textareaHasSocialMediaAccount(aboutMyMatch)) {
    addErrorClass('.about-my-match-error');
    document.querySelector('#about-my-match-error-text').innerHTML =
      'Email addresses and social media accounts are not allowed in your profile';
    document.querySelector('#about-my-match-error-text').style.display = 'block';
    aboutMyMatchIsValid = false;
  } else if (textareaHasPhoneNumber(aboutMyMatch)) {
    addErrorClass('.about-my-match-error');
    document.querySelector('#about-my-match-error-text').innerHTML =
      'Phone numbers are not allowed in your profile';
    document.querySelector('#about-my-match-error-text').style.display = 'block';
    aboutMyMatchIsValid = false;
  } else {
    removeErrorClass('.about-my-match-error');
    document.querySelector('#about-my-match-error-text').style.display = 'none';
    aboutMyMatchIsValid = true;
  }

  const userIPAddress = await getUserIPAddress();

  const userInfo = {
    city,
    state,
    country,
    languages,
    religiousConviction,
    religiousValues,
    maritalStatus,
    education,
    profession,
    relocate,
    diet,
    smokes,
    hasChildren,
    wantsChildren,
    hijab,
    hobbies,
    aboutMe,
    aboutMyMatch,
    userIPAddress,
  };

  if (
    city &&
    languages.length > 0 &&
    religiousConviction &&
    religiousValues &&
    maritalStatus &&
    education &&
    profession &&
    relocate &&
    diet &&
    smokes &&
    hasChildren &&
    wantsChildren &&
    (hijabOptions && hijab) &&
    aboutMeIsValid &&
    aboutMyMatchIsValid
  ) {
    loadingSpinner.style.display = 'block';
    formSubmitButton.innerHTML = '';
    formSubmitButton.disabled = true;
    formSubmitButton.style.cursor = 'not-allowed';

    const toast = document.querySelector('.toast');
    const toastMessage = document.querySelector('.toast-message');

    const images = document.forms.namedItem('signupForm');
    const userData = new FormData(images);
    userData.append('userInfo', JSON.stringify(userInfo));

    let photos = [];
    Array(6).fill().map((_, index) => {
      const imagePreview = document.querySelector(`.image-preview-${index}`);
      photos.push({ image: imagePreview.src, index });
    });
    userData.append('photos', JSON.stringify(photos));

    document.querySelectorAll('form *').forEach(item => item.disabled = true);

    await axios
      .put('/user/api/profile-details', userData)
      .then(() => {
        localStorage.setItem('my_match_profile_update', 'true');
        location.reload();
      })
      .catch(error => {
        console.error('error.message:\n', error.message);
        window.scroll({
          top: 0,
          behavior: 'smooth',
        });

        toast.classList.add('show-toast')
        toast.classList.add('toast-error')
        toastMessage.innerHTML = 'There was an error';
        setTimeout(() => {
          toast.classList.remove('show-toast')
        }, 3000);
      });

    loadingSpinner.style.display = 'none';
    formSubmitButton.innerHTML = 'Save';
    formSubmitButton.disabled = false;
    formSubmitButton.style.cursor = 'pointer';
  } else {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });

    toast.classList.add('show-toast')
    toast.classList.add('toast-error')
    toastMessage.innerHTML = 'There was an error';
    setTimeout(() => {
      toast.classList.remove('show-toast')
    }, 3000);
  }
};
