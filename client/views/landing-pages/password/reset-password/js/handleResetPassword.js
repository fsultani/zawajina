const userPasswordOne = getQuerySelectorById('user-password-one');
const userPasswordTwo = getQuerySelectorById('user-password-two');

let handlePasswordValidationValue = false;

const handlePasswordValidation = ({ passwordOne, passwordTwo }) => {
  if (passwordOne.length < 8 || passwordTwo.length < 8) {
    formMessage('error', 'Password must be at least 8 characters long');
    handlePasswordValidationValue = false;
  } else if (passwordOne !== passwordTwo) {
    formMessage('error', 'Both passwords must match');
    handlePasswordValidationValue = false;
  } else {
    handlePasswordValidationValue = true;
  }
};

const handleResetPassword = async event => {
  event.preventDefault();

  const passwordOne = userPasswordOne.value;
  const passwordTwo = userPasswordTwo.value;

  const searchParams = new URLSearchParams(window.location.search);
  const passwordResetToken = searchParams.get('token') || null;

  handlePasswordValidation({ passwordOne, passwordTwo });

  if (handlePasswordValidationValue) {
    isSubmitting('form-button-loading-spinner-wrapper', true);

    Axios({
      method: 'post',
      apiUrl: '/api/password/reset', // server/routes/password/api.js
      params: {
        newPassword: passwordOne,
        passwordResetToken,
      }
    })
      .then(({ data }) => {
        const { token, redirectUrl } = data;
        Cookies.set('my_match_authToken', token, { sameSite: 'strict' });

        window.location.pathname = redirectUrl;
      })
      .catch((error) => {
        isSubmitting('form-button-loading-spinner-wrapper', false);
        const errorMessage = error.response.data.errorMessage || error.response.statusText || 'We could not complete your request at this time.';

        formMessage('error', errorMessage);
      });
  }
};
