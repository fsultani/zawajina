const togglePassword = () => {
  const passwordType = document.signupForm.elements.password;
  const eye = document.getElementById("passwordEye");

  if (passwordType.type === "password") {
    passwordType.type = "text";
    eye.classList.remove("fa-eye");
    eye.classList.add("fa-eye-slash");
  } else {
    passwordType.type = "password";
    eye.classList.remove("fa-eye-slash");
    eye.classList.add("fa-eye");
  }
};
