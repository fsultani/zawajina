(() => {
  const pathname = window.location.pathname;
  getQuerySelector('body').style.backgroundColor = '#f7f7f7';

  switch (pathname) {
    case '/settings/account':
      getQuerySelector('#account-page').classList.add('active');
      getQuerySelector('#account').style.display = 'block';
      break;
    case '/settings/blocked':
      getQuerySelector('#blocked-users-page').classList.add('active');
      getQuerySelector('#blocked-users').style.display = 'block';
      break;
    case '/settings/security':
      getQuerySelector('#security-page').classList.add('active');
      getQuerySelector('#security').style.display = 'block';
      break;
    default:
      break;
  }

  const usernameValue = getQuerySelector('.name').dataset.name;
  getQuerySelector('.name').value = usernameValue;
})();

const togglePassword = (number) => {
  if (number === '1') {
    const passwordOneType = document.querySelector('.user-password');
    const eyeOne = document.querySelector('.password-eye');

    if (passwordOneType.type === 'password') {
      passwordOneType.type = 'text';
      eyeOne.classList.add('fa-eye');
      eyeOne.classList.remove('fa-eye-slash');
    } else {
      passwordOneType.type = 'password';
      eyeOne.classList.add('fa-eye-slash');
      eyeOne.classList.remove('fa-eye');
    }
  } else {
    const passwordTwoType = document.querySelector('.user-password-two');
    const eyeTwo = document.querySelector('.password-two-eye');

    if (passwordTwoType.type === 'password') {
      passwordTwoType.type = 'text';
      eyeTwo.classList.add('fa-eye');
      eyeTwo.classList.remove('fa-eye-slash');
    } else {
      passwordTwoType.type = 'password';
      eyeTwo.classList.add('fa-eye-slash');
      eyeTwo.classList.remove('fa-eye');
    }
  }
};
