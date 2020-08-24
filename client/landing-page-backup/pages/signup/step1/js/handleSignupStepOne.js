const signupFormElements = document.signupForm.elements;

const user_name = document.signupForm.user_name;
const user_email = document.signupForm.user_email;
const user_password = document.signupForm.user_password;
const signupButton = document.signupForm.signupButton;
const loadingSpinner = document.querySelector(".loading-spinner");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let handleNameValidationValue = false;
let handleEmailValidationValue = false;
let handlePasswordValidationValue = false;

const handleNameValidation = (name) => {
  if (name.length === 0) {
    document.getElementById("name").classList.remove("animate-border-bottom");
    document.getElementById("name-wrapper").classList.add("form-error");
    handleNameValidationValue = false;
  } else if (name.length > 0) {
    if (
      document.getElementById("name-wrapper").classList.contains("form-error")
    ) {
      document.getElementById("name-wrapper").classList.remove("form-error");
      document.getElementById("name").classList.add("animate-border-bottom");
    }
    handleNameValidationValue = true;
  }
};

const handleEmailValidation = (email) => {
  if (!emailRegex.test(email)) {
    document.getElementById("email").classList.remove("animate-border-bottom");
    document.getElementById("email-wrapper").classList.add("form-error");
    handleEmailValidationValue = false;
  } else if (emailRegex.test(email)) {
    if (
      document.getElementById("email-wrapper").classList.contains("form-error")
    ) {
      document.getElementById("email-wrapper").classList.remove("form-error");
      document.getElementById("email").classList.add("animate-border-bottom");
    }
    handleEmailValidationValue = true;
  }
};

const handlePasswordValidation = (password) => {
  if (password.length < 8) {
    document
      .getElementById("password")
      .classList.remove("animate-border-bottom");
    document.getElementById("password-wrapper").classList.add("form-error");
    handlePasswordValidationValue = false;
  } else if (password.length >= 8) {
    if (
      document
        .getElementById("password-wrapper")
        .classList.contains("form-error")
    ) {
      document
        .getElementById("password-wrapper")
        .classList.remove("form-error");
      document
        .getElementById("password")
        .classList.add("animate-border-bottom");
    }
    handlePasswordValidationValue = true;
  }
};

const handleSignupStepOne = () => {
  const name = user_name.value;
  const email = user_email.value;
  const password = user_password.value;

  handleNameValidation(name);
  handleEmailValidation(email);
  handlePasswordValidation(password);

  if (
    handleNameValidationValue &&
    handleEmailValidationValue &&
    handlePasswordValidationValue
  ) {
    loadingSpinner.style.display = "inline-block";
    signupButton.innerHTML = "";
    signupButton.disabled = true;
    signupButton.style.cursor = "not-allowed";

    axios
      .post("/register/api/personal-info", {
        name,
        email,
        password,
      })
      .then((res) => {
        if (res.status === 201) {
          Cookies.set("userId", res.data.userId, { sameSite: "strict" });
          window.location.pathname = "/signup/profile";
        }
      })
      .catch((error) => {
        console.error(error.response);
        if (error.response.status === 403) {
          // Email address already exists
          loadingSpinner.style.display = "none";
          signupButton.innerHTML = "Create Account";
          signupButton.disabled = false;
          signupButton.style.cursor = "pointer";

          document.getElementById("email-exists-error").innerHTML =
            error.response.data.error;
          document.getElementById("email-exists-error").style.display = "block";
        } else {
          // Display generic error message
          loadingSpinner.style.display = "none";
          signupButton.innerHTML = "Create Account";
          signupButton.disabled = false;
          signupButton.style.cursor = "pointer";

          document.getElementById("email-exists-error").innerHTML =
            "We could not complete your request at this time.";
          document.getElementById("email-exists-error").style.display = "block";
        }
      });
  }
};
