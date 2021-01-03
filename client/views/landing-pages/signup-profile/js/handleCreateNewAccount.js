let birthMonth;
let birthDay;
let birthYear;
let gender;
let city;
let state;
let country;
let ethnicity;

const handleBirthMonth = event => (birthMonth = event.target.value);
const handleBirthDay = event => (birthDay = event.target.value);
const handleBirthYear = event => (birthYear = event.target.value);
const handleGender = value => (gender = value);

const createNewAccountButton = document.signupForm.createNewAccount;
const loadingSpinner = document.querySelector(".submit-loading-spinner");

const closeAllLists = element => {
  const inputString = document.querySelector(element);
  /*close all autocomplete lists in the document,
  except the one passed as an argument:*/
  var x = document.getElementsByClassName("autocomplete-items");
  for (var i = 0; i < x.length; i++) {
    if (element != x[i] && element != inputString) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
};

const handleCreateNewAccount = () => {
  const locationValue = document.querySelector("#locationInput");
  const locationData = document.querySelector("#locationInput").dataset;
  city = locationData.city;
  state = locationData.state;
  country = locationData.country;

  const ethnicityValue = document.querySelector("#ethnicityInput");
  const ethnicityData = document.querySelector("#ethnicityInput").dataset;
  ethnicity = ethnicityData.ethnicity

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

  if (!city || !locationValue.value) {
    closeAllLists("#locationInput");
    document.querySelector("#city-error").innerHTML = "Please select your city from the dropdown";
    document.querySelector("#city-error").style.display = "block";
  } else {
    document.querySelector("#city-error").style.display = "none";
  }

  if (!locationValue.value) {
    closeAllLists("#locationInput");
    locationValue.setAttribute("data-city", "");
    locationValue.setAttribute("data-state", "");
    locationValue.setAttribute("data-country", "");
  }

  if (!ethnicity || !ethnicityValue.value) {
    closeAllLists("#ethnicityInput");
    document.querySelector("#ethnicity-error").innerHTML = "Please select your ethnicity from the dropdown"
    document.querySelector("#ethnicity-error").style.display = "block";
  } else {
    document.querySelector("#ethnicity-error").style.display = "none";
  }

  if (!ethnicityValue.value) {
    closeAllLists("#ethnicityInput");
    ethnicityValue.setAttribute("data-ethnicity", "");
  }

  if (birthMonth && birthDay && birthYear && gender && city && locationValue.value && ethnicity && ethnicityValue.value) {
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
        console.error('error.message:\n', error.message);

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
