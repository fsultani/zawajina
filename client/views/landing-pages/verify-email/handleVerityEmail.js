const verificationToken = getQuerySelector('#verification-token');

let tokenIsValid = false;

const hanelTokenVerification = token => {
  let errorMessage = '';

  if (!token.length) {
    errorMessage = 'Enter a verification code';
  } else if (token.length !== 5) {
    errorMessage = 'Verification code must be 5 digits'; 
  }

  if (errorMessage.length) {
    getQuerySelector('#verification-code-error').innerHTML = errorMessage;
    getQuerySelector('#verification-code-error').style.display = 'block';
  } else {
    getQuerySelector('#verification-code-error').style.display = 'none';
    tokenIsValid = true;
  }
};

const handleSubmitToken = async event => {
  event.preventDefault();
  hanelTokenVerification(verificationToken.value);

  if (tokenIsValid) {
    const token = Number(verificationToken.value);
    isSubmitting('submit-button-loading-spinner-wrapper', true);

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
        isSubmitting('submit-button-loading-spinner-wrapper', false);

        const errorMessage = error.response.data.message;
        getQuerySelector('#verification-code-error').innerHTML = errorMessage;
        getQuerySelector('#verification-code-error').style.display = 'block';
      });
  }
};
