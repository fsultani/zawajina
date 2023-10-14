const userEmail = getQuerySelector('.userEmail');
const userPassword = getQuerySelector('.userPassword');

let handleEmailValidationValue = false;
let handlePasswordValidationValue = false;

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
  if (!password.length) {
    handlePasswordValidationValue = false;
    inputElementError('.userPassword', true, '');
    return;
  }

  inputElementError('.userPassword', false, '');
  handlePasswordValidationValue = true;
};

const handleLogin = async event => {
  event.preventDefault();
  const email = userEmail.value;
  const password = userPassword.value;

  handleEmailValidation(email);
  handlePasswordValidation(password);

  if (handleEmailValidationValue && handlePasswordValidationValue) {
    isSubmitting('form-button-loading-spinner-wrapper', true);

    const fingerprint = await getCurrentBrowserFingerPrint();

    Axios({
      method: 'post',
      apiUrl: '/api/auth-session/login', // server/routes/auth/login.js
      params: {
        email,
        password,
        fingerprint,
      }
    })
      .then(res => {
        if (res.data?.userAccountStatus === 'deleted') {
          isSubmitting('form-button-loading-spinner-wrapper', false);
          return inputElementError('.userPassword', false, 'Account was deleted.  Contact us to reopen it.');
        }

        const { cookie, url } = res.data;
        Cookies.set(cookie.type, cookie.value, { sameSite: 'strict' });
        window.location.pathname = url;
      })
      .catch(() => {
        isSubmitting('form-button-loading-spinner-wrapper', false);

        // For any login errors, only display 'Invalid password' for security purposes
        inputElementError('.userPassword', true, 'Invalid Password');
      });
  }
};
