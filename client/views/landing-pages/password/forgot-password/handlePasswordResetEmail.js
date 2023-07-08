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

const handlePasswordResetEmail = async event => {
  event.preventDefault();
  const email = userEmail.value;

  handleEmailValidation(email);

  if (handleEmailValidationValue) {
    isSubmitting('submit-button-loading-spinner-wrapper', true);

    Axios({
      method: 'post',
      apiUrl: '/api/password/request-email', // server/routes/password/api.js
      params: {
        email,
      }
    })
      .then(({ data }) => {
        isSubmitting('submit-button-loading-spinner-wrapper', false);

        const emailSentMessage = getQuerySelector('#email-sent-message');
        emailSentMessage.innerHTML =
          `A password reset email was sent.
          <br>
          If the email exists in our database, you should receive it soon.`;
        emailSentMessage.style.display = 'block';

        const formButton = getQuerySelector('.form-submit');
        const url = data?.url;

        formButton.innerHTML = 'Back';
        formButton.onclick = () => window.location.pathname = url;
      })
      .catch(() => {
        isSubmitting('submit-button-loading-spinner-wrapper', false);
  
        getQuerySelector('#email-error').innerHTML = 'Unknown error';
      });
  }
};
