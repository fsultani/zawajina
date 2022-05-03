const addErrorClass = element => {
  document.querySelector(`${element}`).classList.add('form-error')

  headerElements.forEach(element => {
    element.style.height = '55px';
  });
};

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
const handleHtmlEscape = string => '' + string.replace(htmlEscapeRegex, match => htmlEscapes[match]).replace(/[\u2018\u2019]/g, '&#x27;');
const handleReplaceBrTag = string => '' + string.replace(/<br>/g, '\n');

const loadingSpinner = document.querySelector('.loading-spinner');

const headerElements = Array.from(
  document.getElementsByClassName('full-width form-header')
);

const handleSaveProfileChanges = async () => {
  const locationData = document.querySelector('#locationInput').dataset;
  const city = locationData.city;
  const state = locationData.state !== 'null' ? locationData.state : null;
  const country = locationData.country;

  if (!city) {
    closeAllLists('#locationInput');
    document.querySelector('.user-location').style.cssText = 'padding-bottom: 4px';
    document.querySelector('#city-error').innerHTML = 'Please select your city from the dropdown';
    document.querySelector('#city-error').style.display = 'block';
  } else {
    document.querySelector('#city-error').style.display = 'none';
  }

  const aboutMe = handleHtmlEscape(document.getElementById('edit-about-me').value);
  let aboutMeIsValid = true;
  if (editAboutMe) {
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
  }

  const aboutMyMatch = handleHtmlEscape(document.getElementById('edit-about-my-match').value);
  let aboutMyMatchIsValid = true;
  if (editAboutMyMatch) {
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
  }

  const userIPAddress = await getUserIPAddress();

  let userInfo = {
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

  if (editAboutMe && !aboutMeIsValid) {
    return;
  }

  if (editAboutMyMatch && !aboutMyMatchIsValid) {
    return;
  }

  const images = document.forms.namedItem('profileForm');
  const userData = new FormData(images);
  userData.append('userInfo', JSON.stringify(userInfo));

  loadingSpinner.style.cssText = `display: flex`;
  document.querySelectorAll('form *').forEach(item => {
    item.disabled = true;
    item.style.opacity = 0.9;
    item.style.pointerEvents = 'none';
  });
  document.querySelector('.settings-form').style.cursor = 'not-allowed';

  let photos = [];
  Array(6).fill().map((_, index) => {
    const imagePreview = document.querySelector(`.image-preview-${index}`);
    photos.push({ image: imagePreview.src, index });
  });
  userData.append('photos', JSON.stringify(photos));

  await axios
    .put('/user/api/profile-details', userData)
    .then(() => {
      globalThis.toast('success', 'Profile successfully updated!');

      const modal = getQuerySelector('.modal');
      const modalContent = getQuerySelector('.modal-content');
      modalContent.style.cssText = `
        z-index: -1;
        opacity: 0;
        animation: hide .2s;
      `;

      setTimeout(() => {
        modal.style.display = 'none';
      }, 200)
    })
    .catch(error => {
      console.log(`error\n`, error);
      window.scroll({
        top: 0,
        behavior: 'smooth',
      });

      globalThis.toast('error', 'There was an error');
    });
};
