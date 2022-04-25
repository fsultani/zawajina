const userPasswordOne = document.querySelector('.user-password-one');
const userPasswordTwo = document.querySelector('.user-password-two');
const submitButton = document.querySelector('#submitButton');
const loadingSpinner = document.querySelector('.loading-spinner');

let handlePasswordValidationValue = false;

const handlePasswordValidation = ({ passwordOne, passwordTwo }) => {
  if (passwordOne.length < 8 || passwordTwo.length < 8) {
    document.querySelector('.form-submission-error').style.display = 'block';
    document.querySelector('.form-submission-error').innerHTML = 'Password must be at least 8 characters long';
    handlePasswordValidationValue = false;
  } else if (passwordOne !== passwordTwo) {
    document.querySelector('.form-submission-error').style.display = 'block';
    document.querySelector('.form-submission-error').innerHTML = 'Both passwords must match';
    handlePasswordValidationValue = false;
  } else {
    document.querySelector('.form-submission-error').style.display = 'none';
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
    loadingSpinner.style.display = 'inline-block';
    submitButton.innerHTML = '';
    submitButton.disabled = true;
    submitButton.style.cursor = 'not-allowed';

    document.querySelectorAll('form *').forEach(item => item.disabled = true);

    const userIPAddress = await getUserIPAddress();

    axios
      .post('/password/api/reset', {
        newPassword: passwordOne,
        userIPAddress,
        passwordResetToken,
      })
      .then(res => {
        if (res.status === 201) {
          const { token } = res.data;
          Cookies.set('my_match_authToken', token, { sameSite: 'strict' });

          const { search } = new URL(window.location.href);
          const params = new URLSearchParams(search);
          params.delete('token');
          const pathname = `/users?${params.toString()}`;
          window.location.pathname = pathname;
        }
      })
      .catch(error => {
        console.error(error.response);
        loadingSpinner.style.display = 'none';
        submitButton.innerHTML = 'Reset Password';
        submitButton.disabled = false;
        submitButton.style.cursor = 'pointer';

        document.querySelector('.form-submission-error').innerHTML = `
          <p>Your password reset request has expired.</p>
          <p>Please try again.</p>
        `;
        document.querySelector('.form-submission-error').style.display = 'block';
      });
  }
};
