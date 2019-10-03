const togglePassword = () => {
  const passwordType = document.signupForm.elements.password;
  const eye = document.getElementById('passwordEye');

  if (passwordType.type === 'password') {
    passwordType.type = 'text';
    eye.classList.add('zmdi-eye');
  } else {
    passwordType.type = 'password';
    eye.classList.remove('zmdi-eye');
  }
}
