let birthMonth;
let birthDay;
let birthYear;
let gender;

const handleBirthMonth = event => (birthMonth = event.target.value);
const handleBirthDay = event => (birthDay = event.target.value);
const handleBirthYear = event => (birthYear = event.target.value);
const handleGender = value => (gender = value);

const createNewAccountButton = document.querySelector("#createNewAccount");
const loadingSpinner = document.querySelector(".submit-loading-spinner");

const handleCreateNewAccount = () => {
  const locationData = document.querySelector("#locationInput").dataset;
  const city = locationData.city;
  const state = locationData.state;
  const country = locationData.country;

  const ethnicity = [];
  document.querySelectorAll('.user-ethnicity-content').forEach(({ id }) => {
    ethnicity.push(id)
  })

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
    closeAllLists("#locationInput");
    document.querySelector('.user-location').style.cssText = 'padding-bottom: 4px';
    document.querySelector("#city-error").innerHTML = "Please select your city from the dropdown";
    document.querySelector("#city-error").style.display = "block";
  } else {
    document.querySelector('.user-location').style.cssText = 'padding-bottom: 16px';
    document.querySelector("#city-error").style.display = "none";
  }

  if (ethnicity.length === 0) {
    closeAllLists("#ethnicityInput");
    document.querySelector('.user-ethnicity').style.cssText = 'padding-bottom: 4px';
    document.querySelector("#ethnicity-error").innerHTML =
      "Please select your ethnicity from the dropdown";
    document.querySelector("#ethnicity-error").style.display = "block";
  } else {
    document.querySelector('.user-ethnicity').style.cssText = 'padding-bottom: 16px';
    document.querySelector("#ethnicity-error").style.display = "none";
  }

  if (
    birthMonth &&
    birthDay &&
    birthYear &&
    gender &&
    city &&
    ethnicity.length > 0
  ) {
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
      ethnicity,
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
          window.location.pathname = "/users";
        } else {
          document.querySelector("#signup-error").innerHTML =
            "Unknown error.  Please try again later.";
          document.querySelector("#signup-error").style.display = "block";
        }
      })
      .catch(error => {
        console.error("error.message:\n", error.message);

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
