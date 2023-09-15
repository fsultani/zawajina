const userEmail = getQuerySelector('#userEmail');

let handleEmailValidationValue = false;

const handleEmailValidation = email => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!emailRegex.test(email)) {
    getQuerySelector('#email-wrapper').style.cssText = `border-bottom: 2px solid red;`
    getQuerySelector('#email-error').innerHTML = 'Invalid email';
    handleEmailValidationValue = false;
  } else {
    getQuerySelector('#email-wrapper').style.cssText = `border-bottom: 2px solid #adadad;`
    getQuerySelector('#email-error').innerHTML = '';
    handleEmailValidationValue = true;
  }

};

const handleForgotPasswordEmail = async event => {
  event.preventDefault();
  const email = userEmail.value;

  handleEmailValidation(email);

  if (handleEmailValidationValue) {
    isSubmitting('form-button-loading-spinner-wrapper', true);

    Axios({
      method: 'post',
      apiUrl: '/api/password/request-email', // server/routes/password/api.js
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
      .catch(() => {
        isSubmitting('form-button-loading-spinner-wrapper', false);
  
        formMessage('error', 'Unknown error');
      });
  }
};
