const submitButton = document.querySelector('#submitButton');
const loadingSpinner = document.querySelector('.loading-spinner');

const handleVerityEmail = () => {
  const verificationToken = document.querySelector('.verification-token').value;
  if (verificationToken.length === 0) {
    document.getElementById('verification-code-error').innerHTML = 'Enter a verification code'
    document.getElementById('verification-code-error').style.display = 'block';
  } else if (verificationToken.length < 5) {
    document.getElementById('verification-code-error').innerHTML = 'Verification code must be 5 digits'
    document.getElementById('verification-code-error').style.display = 'block';
  } else {
    document.getElementById('verification-code-error').style.display = 'none';
    loadingSpinner.style.cssText = `
      display: inline-block;
      z-index: 1;
    `
    submitButton.style.opacity = 0.5;
    submitButton.disabled = true;
    submitButton.style.cursor = 'not-allowed';

    axios.get('/register/api/verify-email', {
      params: { verificationToken }
    })
    .then(res => {
      if (res.status === 200) {
        window.location.pathname = '/signup/profile';
      } else {
        loadingSpinner.style.cssText = `
          display: inline-block;
          z-index: 1;
        `
        submitButton.style.opacity = 0.5;
        submitButton.disabled = true;
        submitButton.style.cursor = 'not-allowed';
      }
    })
    .catch(error => {
      console.error(error.response);
      document.getElementById('verification-code-error').innerHTML = 'Invalid verification code'
      document.getElementById('verification-code-error').style.display = 'block';
      loadingSpinner.style.display = 'none';
      submitButton.style.opacity = 1;
      submitButton.disabled = false;
      submitButton.style.cursor = 'auto';
    });
  }
};
