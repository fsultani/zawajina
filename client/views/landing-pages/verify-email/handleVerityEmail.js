const verificationToken = getQuerySelector('.verification');

const hanelTokenVerification = token => {
  if (!token.length) {
    inputElementError('.verification', true, 'Enter a verification code');
    return false;
  } else if (token.length !== 5) {
    inputElementError('.verification', true, 'Verification code must be 5 digits');
    return false;
  }

  return true;
};

const handleSubmitToken = async event => {
  event.preventDefault();

  const tokenIsValid = hanelTokenVerification(verificationToken?.value);

  if (tokenIsValid) {
    const token = Number(verificationToken.value);
    isSubmitting('form-button-loading-spinner-wrapper', true);

    Axios({
      method: 'put',
      apiUrl: '/api/register/verify-email', // server/routes/register/verifyEmail.js
      params: {
        token,
      }
    })
      .then(({ data }) => {
        const url = data?.url;
        window.location.pathname = url;
      })
      .catch((error) => {
        isSubmitting('form-button-loading-spinner-wrapper', false);
        inputElementError('.verification', false, '');

        const errorMessage = error.response.data.message;
        formMessage('error', errorMessage);
      });
  }
};
