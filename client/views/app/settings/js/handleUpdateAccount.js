const toast = globalThis.toast;

let nameIsValid = false;
let emailIsValid = false;
let passwordIsValid = false;
let errorMessage = '';

const loadingSpinner = document.querySelector('.loading-spinner');
const formSubmitButton = document.querySelector('.form-submit');

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

const handleNameValidation = name => {
  const invalidCharacters = /[0-9!@#$%^&*()_\+=[\]{}|:;"<,>\?\/\\~`]/g;
  const validName = !invalidCharacters.test(name);
  addErrorClass('.name')

  if (name.length === 0) {
    errorMessage = '<p>Name cannot be blank</p>';
    nameIsValid = false;
  } else if (!validName) {
    errorMessage = '<p>Name cannot contain numbers or special characters</p>';
    nameIsValid = false;
  } else {
    errorMessage = '';
    removeErrorClass('.name')
    nameIsValid = true;
  }
};

const handleEmailValidation = email => {
  if (email.length === 0) {
    errorMessage += '<p>Email cannot be blank</p>';
    addErrorClass('.email')
    emailIsValid = false;
  } else {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  
    if (!emailRegex.test(email)) {
      errorMessage += '<p>Email format must be valid</p>';
      addErrorClass('.email')
      emailIsValid = false;
    } else {
      errorMessage += '';
      removeErrorClass('.email')
      emailIsValid = true;
    }
  }
};

const handlePasswordValidation = ({ userPassword, confirmUserPassword }) => {
  addErrorClass('.user-password')
  addErrorClass('.confirm-user-password')

  if (userPassword.length < 8 || confirmUserPassword.length < 8) {
    errorMessage += '<p>Password must be at least 8 characters long</p>';
    if (userPassword !== confirmUserPassword) {
      errorMessage += '<p>Both passwords must match</p>';
    }
    passwordIsValid = false;
  } else if (userPassword !== confirmUserPassword) {
    errorMessage += '<p>Both passwords must match</p>';
    passwordIsValid = false;
  } else {
    errorMessage += '';
    removeErrorClass('.user-password')
    removeErrorClass('.confirm-user-password')
    passwordIsValid = true;
  }
};

const handleUpdateAccount = async () => {
  const name = getQuerySelector('.name').value;
  const email = getQuerySelector('.email').value;
  const userPassword = getQuerySelector('.user-password').value;
  const confirmUserPassword = getQuerySelector('.confirm-user-password').value;

  handleNameValidation(name);
  handleEmailValidation(email);

  if (!nameIsValid || !emailIsValid) {
    getQuerySelector('.form-submission-error').style.display = 'block';
    return getQuerySelector('.form-submission-error').innerHTML = errorMessage;
  } else {
    getQuerySelector('.form-submission-error').style.display = 'none';
  }

  if (userPassword.length > 0 && confirmUserPassword.length > 0) {
    handlePasswordValidation({ userPassword, confirmUserPassword });

    if (!passwordIsValid) {
      getQuerySelector('.form-submission-error').style.display = 'block';
      return getQuerySelector('.form-submission-error').innerHTML = errorMessage;
    } else {
      getQuerySelector('.form-submission-error').style.display = 'none';
    }
  }

  const newUserPassword = userPassword.length > 0 && confirmUserPassword.length > 0 ? userPassword : null;

  loadingSpinner.style.display = 'flex';
  formSubmitButton.innerHTML = '';
  formSubmitButton.disabled = true;
  formSubmitButton.style.cursor = 'not-allowed';

  document.querySelectorAll('form *').forEach(item => item.disabled = true);

  const userIPAddress = await getUserIPAddress();

  axios
    .put('/settings/account', {
      name,
      email,
      newUserPassword,
      userIPAddress,
    })
    .then(() => {
      toast('success', 'Account successfully updated!');
    })
    .catch(() => {
      toast('error', 'There was an error');
    });
}
