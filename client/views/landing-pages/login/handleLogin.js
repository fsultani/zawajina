const userEmail = getQuerySelector('#userEmail');
const userPassword = getQuerySelector('#userPassword');

let handleEmailValidationValue = false;
let handlePasswordValidationValue = false;

const handleEmailValidation = email => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!emailRegex.test(email)) {
    handleEmailValidationValue = false;
    getQuerySelector('#email-wrapper').style.cssText = `border-bottom: 2px solid red;`
    getQuerySelector('#email-span').classList.remove('input-focus')
    getQuerySelector('#email-error').innerHTML = 'Invalid email';
    return;
  }

  getQuerySelector('#email-wrapper').style.cssText = `border-bottom: 2px solid #adadad;`
  getQuerySelector('#email-span').classList.add('input-focus')
  getQuerySelector('#email-error').innerHTML = '';

  handleEmailValidationValue = true;
};

const handlePasswordValidation = password => {
  if (!password.length) {
    getQuerySelector('#password-wrapper').style.cssText = `border-bottom: 2px solid red;`
    getQuerySelector('#password-span').classList.remove('input-focus');
    getQuerySelector('#password-error').innerHTML = 'Password cannot be blank';
    handlePasswordValidationValue = false;
    return;
  }

  getQuerySelector('#password-wrapper').style.cssText = `border-bottom: 2px solid #adadad;`
  getQuerySelector('#password-span').classList.add('input-focus');
  getQuerySelector('#password-error').innerHTML = '';

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

    Axios({
      method: 'post',
      apiUrl: '/api/auth-session/login', // server/routes/auth/login.js
      params: {
        email,
        password
      }
    })
      .then(res => {
        const { cookie, url } = res.data;
        Cookies.set(cookie.type, cookie.value, { sameSite: 'strict' });
        window.location.pathname = url;
      })
      .catch(() => {
        isSubmitting('form-button-loading-spinner-wrapper', false);

        // For any login errors, only display 'Invalid password' for security purposes
        getQuerySelector('#password-wrapper').style.cssText = `border-bottom: 2px solid red;`
        getQuerySelector('#password-wrapper').style.cssText = `border-bottom: 2px solid red;`
        getQuerySelector('#password-span').classList.remove('input-focus');

        getQuerySelector('#password-error').innerHTML = 'Invalid Password';
      });
  }
};
