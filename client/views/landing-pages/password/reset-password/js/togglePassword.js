const togglePassword = number => {
  if (number === 1) {
    const passwordOneType = getQuerySelectorById('user-password-one');
    const eyeOne = getQuerySelector('.password-one-eye');

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
    const passwordTwoType = getQuerySelectorById('user-password-two');
    const eyeTwo = getQuerySelector('.password-two-eye');

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
