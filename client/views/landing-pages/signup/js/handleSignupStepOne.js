const username = getQuerySelector('.username');
const userEmail = getQuerySelector('.userEmail');
const userPassword = getQuerySelector('.userPassword');

let handleNameValidationValue = false;
let handleEmailValidationValue = false;
let handlePasswordValidationValue = false;

const handleNameValidation = name => {
  const invalidCharactersRegex = /[!@#$%^&*()_\+=[\]{}|:;"<,>\?\/\\~`]/;
  const invalidCharacters = string => invalidCharactersRegex.test(string);

  const numbersRegex = /\d/;
  const inputHasAtLeastOneNumber = string => numbersRegex.test(string);

  if (
    !name ||
    inputHasSocialMediaAccount(name) ||
    inputHasSocialMediaTag(name) ||
    inputHasPhoneNumber(name) ||
    invalidCharacters(name) ||
    inputHasAtLeastOneNumber(name) ||
    preventWebLinks(name)
  ) {
    handleNameValidationValue = false;

    let errorMessage = '';
    if (name.length === 0) {
      errorMessage = 'Name cannot be blank';
    } else if (inputHasSocialMediaAccount(name) || inputHasSocialMediaTag(name)) {
      errorMessage = 'No email or social media accounts allowed';
    } else if (inputHasPhoneNumber(name)) {
      errorMessage = 'Phone numbers are not allowed';
    } else if (invalidCharacters(name)) {
      errorMessage = 'Name cannot contain special characters';
    } else if (inputHasAtLeastOneNumber(name)) {
      errorMessage = 'Name cannot contain a number';
    } else if (preventWebLinks(name)) {
      errorMessage = 'Web links are not allowed';
    }

    inputElementError('.username', true, errorMessage);
  } else {
    handleNameValidationValue = true;
    inputElementError('.username', false, '');
  }
};

const handleEmailValidation = email => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!emailRegex.test(email)) {
    handleEmailValidationValue = false;
    inputElementError('.userEmail', true, 'Invalid email');
  } else if (emailRegex.test(email)) {
    handleEmailValidationValue = true;
    inputElementError('.userEmail', false, '');
  }
};

const handlePasswordValidation = password => {
  if (password.length < 8) {
    handlePasswordValidationValue = false;
    inputElementError('.userPassword', true, '');
  } else if (password.length >= 8) {
    handlePasswordValidationValue = true;
    inputElementError('.userPassword', false, '');
  }
};

const handleSignupStepOne = async event => {
  event.preventDefault();

  const nameValue = username.value;
  const email = userEmail.value;
  const password = userPassword.value;

  handleNameValidation(nameValue);
  handleEmailValidation(email);
  handlePasswordValidation(password);

  if (handleNameValidationValue && handleEmailValidationValue && handlePasswordValidationValue) {
    isSubmitting('form-button-loading-spinner-wrapper', true);

    const fingerprint = await getCurrentBrowserFingerPrint();

    Axios({
      method: 'post',
      apiUrl: '/api/register/personal-info', // server/routes/register/personalInfo.js
      params: {
        nameValue,
        email,
        password,
        fingerprint,
      }
    })
      .then(({ data }) => {
        const { authUserId, url } = data;
        Cookies.set('my_match_authUserId', authUserId, { sameSite: 'strict' });
        window.location.pathname = url;
      })
      .catch(error => {
        isSubmitting('form-button-loading-spinner-wrapper', false);

        if (error.response.status === 403) {
          /* Email address already exists */
          const message = error.response.data.message;
          formMessage('error', message);
        } else if (error.response?.data) {
          /*
            This conditional only checks for the 'name' value.
            Email and password are checked below
           */
          if (error.response.data?.querySelector) {
            const querySelector = error.response.data.querySelector;
            const message = error.response.data.message;

            getQuerySelectorById(querySelector).classList.remove('animate-border-bottom');
            getQuerySelectorById(`${querySelector}-wrapper`).style.cssText = `border-bottom: 2px solid red;`
            getQuerySelectorById(`${querySelector}-error`).innerHTML = message;
          }

          /*
            Display error messages for invalid email and/or password
           */
          error.response.data.errors.map(error => {
            getQuerySelector(`#${error.param}`).classList.remove('animate-border-bottom');
            getQuerySelector(`#${error.param}-wrapper`).style.cssText = `border-bottom: 2px solid red;`
            getQuerySelector(`#${error.param}-error`).innerHTML = error.msg;
          })
        } else {
          /* Display generic error message */
          formMessage('error', 'We could not complete your request at this time.');
        }
      });
  }
};
