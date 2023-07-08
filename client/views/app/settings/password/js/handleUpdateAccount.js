let passwordIsValid = false;
let errorMessage = '';

const handlePasswordValidation = ({ userPassword, confirmUserPassword }) => {
  addErrorClass('.user-password')
  addErrorClass('.confirm-user-password')

  if (userPassword.length < 8 || confirmUserPassword.length < 8) {
    errorMessage = '<p>Password must be at least 8 characters long</p>';
    if (userPassword !== confirmUserPassword) {
      errorMessage = '<p>Both passwords must match</p>';
    }
    passwordIsValid = false;
  } else if (userPassword !== confirmUserPassword) {
    errorMessage = '<p>Both passwords must match</p>';
    passwordIsValid = false;
  } else {
    errorMessage = '';
    removeErrorClass('.user-password')
    removeErrorClass('.confirm-user-password')
    passwordIsValid = true;
  }
};

const handleUpdateAccount = async () => {
  const userPassword = getQuerySelector('.user-password').value;
  const confirmUserPassword = getQuerySelector('.confirm-user-password').value;

  if (userPassword.length > 0 && confirmUserPassword.length > 0) {
    handlePasswordValidation({ userPassword, confirmUserPassword });

    const passwordErrorTextElement = getQuerySelector('#password-error-text');
    if (!passwordIsValid) {
      passwordErrorTextElement.innerHTML = errorMessage;
      passwordErrorTextElement.style.display = 'flex';
    } else {
      passwordErrorTextElement.style.display = 'none';
    }
  }

  if (passwordIsValid) {
    const newUserPassword = userPassword.length > 0 && confirmUserPassword.length > 0 ? userPassword : null;
  
    isSubmitting('submit-button-loading-spinner-wrapper', true);
  
    try {
      await Axios({
        method: 'put',
        apiUrl: '/api/settings/password', // server/routes/settings/index.js
        params: {
          newUserPassword,
        }
      });
  
      isSubmitting('submit-button-loading-spinner-wrapper', false);
      toast('success', 'Password successfully updated!');
    } catch (error) {
      console.error(error)
      isSubmitting('submit-button-loading-spinner-wrapper', false);
      toast('error', 'There was an error');
    }
  }
}
