const userPasswordOne = getQuerySelector('#user-password-one');
const userPasswordTwo = getQuerySelector('#user-password-two');

let handlePasswordValidationValue = false;

const handlePasswordValidation = ({ passwordOne, passwordTwo }) => {
  if (passwordOne.length < 8 || passwordTwo.length < 8) {
    getQuerySelector('#form-submission-error').style.display = 'block';
    getQuerySelector('#form-submission-error').innerHTML = 'Password must be at least 8 characters long';
    handlePasswordValidationValue = false;
  } else if (passwordOne !== passwordTwo) {
    getQuerySelector('#form-submission-error').style.display = 'block';
    getQuerySelector('#form-submission-error').innerHTML = 'Both passwords must match';
    handlePasswordValidationValue = false;
  } else {
    getQuerySelector('#form-submission-error').style.display = 'none';
    handlePasswordValidationValue = true;
  }
};

const handleResetPassword = async () => {
  const passwordOne = userPasswordOne.value;
  const passwordTwo = userPasswordTwo.value;

  const searchParams = new URLSearchParams(window.location.search);
  const passwordResetToken = searchParams.get('token') || null;

  handlePasswordValidation({ passwordOne, passwordTwo });

  if (handlePasswordValidationValue) {
    isSubmitting('submit-button-loading-spinner-wrapper', true);

    Axios({
      method: 'post',
      apiUrl: '/api/password/reset', // server/routes/password/api.js
      params: {
        newPassword: passwordOne,
        passwordResetToken,
      }
    })
      .then(({ data }) => {
        const { token, url } = data;
        Cookies.set('my_match_authToken', token, { sameSite: 'strict' });

        window.location.pathname = url;
      })
      .catch((error) => {
        isSubmitting('submit-button-loading-spinner-wrapper', false);
        const errorMessage = error.response.data.errorMessage || error.response.statusText || 'We could not complete your request at this time.';

        getQuerySelector('#form-submission-error').innerHTML = errorMessage;
        getQuerySelector('#form-submission-error').style.display = 'block';
      });
  }
};
