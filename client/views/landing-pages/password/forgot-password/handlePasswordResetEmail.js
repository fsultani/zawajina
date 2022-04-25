const handleEmailValidation = () => {
  const email = document.resetPassword.elements.email.value;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email);
};

const handlePasswordResetEmail = async event => {
  event.preventDefault();
  const email = document.resetPassword.elements.email.value.toLowerCase()
  const resetPasswordButton = document.resetPassword.elements.resetPasswordButton;
  const loadingSpinner = document.querySelector('.loading-spinner');

  const emailIsValid = handleEmailValidation();

  if (emailIsValid) {
    loadingSpinner.style.cssText = `display: inline-block`;
    resetPasswordButton.innerHTML = '';
    resetPasswordButton.style.cssText = `
      disabled: true;
      opacity: 0.5;
      cursor: not-allowed;
    `;

    document.querySelectorAll('form *').forEach(item => item.disabled = true);

    const userIPAddress = await getUserIPAddress();
    axios
      .post('/password/api/request', {
        email,
        userIPAddress,
      })
      .then(res => {
        loadingSpinner.style.display = 'none';
        resetPasswordButton.innerHTML = 'Login';
        resetPasswordButton.style.cssText = `
          disabled: false;
          opacity: 1;
          cursor: pointer;
        `;

        const emailSentMessage = document.querySelector('.email-sent-message');

        if (res.status === 201) {
          emailSentMessage.innerHTML =
            `A password reset email was sent.  If the email exists in our database, you should receive it soon.`;
          emailSentMessage.style.display = 'block';
        }
      })
      .catch(() => {
        loadingSpinner.style.display = 'none';
        resetPasswordButton.innerHTML = 'Login';
          resetPasswordButton.style.cssText = `
          disabled: false;
          opacity: 1;
          cursor: pointer;
        `;
      });
  } else {
    if (!emailIsValid) {
      document.resetPassword.email.blur();
      document.getElementById('email').classList.add('email-error');
      document.getElementById('email-wrapper').classList.add('form-error');
    }

    const emailHasError = document.getElementById('email').classList.contains('email-error');
    if (emailIsValid && emailHasError) {
      document.getElementById('email').classList.remove('email-error');
      document.getElementById('email-wrapper').classList.remove('form-error');
    }
  }
};
