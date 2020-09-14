let birthMonth;
let birthDay;
let birthYear;
let gender;
let city;
let state;
let country;

const handleBirthMonth = event => (birthMonth = event.target.value);
const handleBirthDay = event => (birthDay = event.target.value);
const handleBirthYear = event => (birthYear = event.target.value);
const handleGender = value => (gender = value);

const createNewAccountButton = document.signupForm.createNewAccount;
const loadingSpinner = document.querySelector(".submit-loading-spinner");

const handleCreateNewAccount = () => {
  const data = document.querySelector("#myInput").dataset;
  city = data.city;
  state = data.state;
  country = data.country;

  const addErrorClass = element => document.querySelector(`${element}`).classList.add("form-error");
  const removeErrorClass = element =>
    document.querySelector(`${element}`).classList.remove("form-error");

  if (!birthMonth) {
    addErrorClass("#dob-month");
  } else {
    removeErrorClass("#dob-month");
  }

  if (!birthDay) {
    addErrorClass("#dob-day");
  } else {
    removeErrorClass("#dob-day");
  }

  if (!birthYear) {
    addErrorClass("#dob-year");
  } else {
    removeErrorClass("#dob-year");
  }

  if (!gender) {
    addErrorClass(".form-flex");
  } else {
    removeErrorClass(".form-flex");
  }

  if (!city) {
    document.querySelector("#city-error").innerHTML = "Please enter your city";
    document.querySelector("#city-error").style.display = "block";
  } else {
    document.querySelector("#city-error").style.display = "none";
  }

  if (birthMonth && birthDay && birthYear && gender && city) {
    loadingSpinner.style.display = "inline-block";
    createNewAccountButton.innerHTML = "";
    createNewAccountButton.disabled = true;
    createNewAccountButton.style.cursor = "not-allowed";

    const userInfo = {
      birthMonth,
      birthDay,
      birthYear,
      gender,
      city,
      state,
      country,
    };

    const images = document.forms.namedItem("signupForm");
    const userData = new FormData(images);
    userData.append("userInfo", JSON.stringify(userInfo));
    userData.append("userId", Cookies.get("userId"));

    axios
      .post("/register/api/about", userData)
      .then(res => {
        if (res.status === 201 || res.status === 200) {
          Cookies.set("token", res.data.token, { sameSite: "strict" });
          Cookies.remove("userId");
          window.location.pathname = "/";
        } else {
          document.querySelector("#signup-error").innerHTML =
            "Unknown error.  Please try again later.";
          document.querySelector("#signup-error").style.display = "block";
        }
      })
      .catch(error => {
        console.error("error:\n", error);

        loadingSpinner.style.display = "none";
        createNewAccountButton.innerHTML = "Create Account";
        createNewAccountButton.disabled = false;
        createNewAccountButton.style.cursor = "pointer";

        document.querySelector("#signup-error").innerHTML =
          "Unknown error.  Please try again later.";
        document.querySelector("#signup-error").style.display = "block";
      });
  }
};
