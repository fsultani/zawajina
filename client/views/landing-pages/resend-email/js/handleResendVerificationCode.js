const userEmail = getQuerySelector('.userEmail');

let handleEmailValidationValue = false;

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

const handleResendVerificationCode = (event) => {
  event.preventDefault();

  const email = userEmail.value;
  handleEmailValidation(email);

  const resendCodeButton = getQuerySelector('.form-submit').innerHTML.trim() === 'Resend Code'

  if (handleEmailValidationValue && resendCodeButton) {
    isSubmitting('form-button-loading-spinner-wrapper', true);

    Axios({
      method: 'post',
      apiUrl: '/api/register/resend-email', // server/routes/register/resendEmail.js
      params: {
        email,
      }
    })
      .then(({ data }) => {
        isSubmitting('form-button-loading-spinner-wrapper', false);
        const emailSentMessage =
          `A password reset email was sent.<br>If the email exists in our database, you should receive it soon.`;

        formMessage('success', emailSentMessage);

        const formButton = getQuerySelector('.form-submit');
        const url = data?.url;

        formButton.innerHTML = 'Back';
        formButton.onclick = () => window.location.pathname = url;
      })
      .catch(error => {
        isSubmitting('form-button-loading-spinner-wrapper', false);

        const errorMessage = error.response.data.message || error.response.statusText || 'We could not complete your request at this time.';
        formMessage('error', errorMessage);
      });
  }
};
