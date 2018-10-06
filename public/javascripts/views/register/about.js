'use strict';

let countrySelected
let stateSelected
let citySelected

let countrySelection
let stateSelection
let citySelection

const getAllCountries = () => {
  axios.get('/register/api/all-countries')
  .then(country => {
    country.data.map(country => {
      countrySelected.options[countrySelected.options.length] = new Option(country.name, country.id)
    })
  })
}

const handleCountrySelection = () => {
  countrySelection = countrySelected.options[countrySelected.selectedIndex].text
  stateSelected.style.display = 'none'

  // For U.S. states
  if (countrySelected.value === '231') {
    stateSelected.style.display = 'block'
    axios.get('/register/api/state-list?country=231')
    .then(state => {
      state.data.map(state => {
        stateSelected.options[stateSelected.options.length] = new Option(state.name, state.id)
      })
    })
  } else {
    // For non U.S. cities
    axios.get(`/register/api/state-list?country=${countrySelected.value}`)
    .then(state => {
      state.data.map(state => {
        citySelected.options[citySelected.options.length] = new Option(state.name, state.id)
      })
    })
  }
}

const handleStateSelection = () => {
  stateSelection = stateSelected.options[stateSelected.selectedIndex].text

  axios.get(`/register/api/city-list?city=${stateSelected.value}`)
  .then(city => {
    city.data.map(city => {
      citySelected.options[citySelected.options.length] = new Option(city.name, city.id)
    })
  })
}

const handleCitySelection = () => {
  citySelection = citySelected.options[citySelected.selectedIndex].text

  axios.get(`/register/api/city-list?city=${stateSelected.value}`)
  .then(city => {
    city.data.map(city => {
      citySelected.options[citySelected.options.length] = new Option(city.name, city.id)
    })
  })
  if (countrySelected.value && stateSelected.value && citySelected.value) {
    document.getElementById('submitButton').disabled = false
  }
}

const day = () => {
  const dayOptions = []
  const res = [...Array(32)].map((_, i) => dayOptions.push(`<option>${i+1}</option>`))
  return dayOptions
}

const year = () => {
  let yearOptions = []
  const res = [...Array(61)].map((_, i) => yearOptions.push(`<option>${1940+i}</option>`))
  return yearOptions.reverse()
}

const almostDone = `<center><h2>Sweet!  Almost done</h2></center>`

const titleStyle = {
  'font-size': '16px',
  'color': '#727272',
  'text-align': 'center',
}

const title = `
  <div id="copy">
    <p>
      To help match you with the right type of people, please answer a few short questions.
    </p>
  </div>
`

const genderSelection = `
  <div class="col-md-4 col-md-offset-4 gender-container" style="padding-left: 0">
    <h5>Gender</h5>
    <div class="gender-input-group">
      <input
        id="male"
        type="radio"
        name="gender"
        value="male"
      >
      <label for="male" class="gender-male">Male</label>
      <input
        id="female"
        type="radio"
        name="gender"
        value="female"
      >
      <label for="female">Female</label>
    </div>
  </div>
`

const dob = `
  <div class="col-md-4 col-md-offset-4" style="padding-left: 0">
    <div>Date of Birth</div>
    <div class="dob-container">
      <select name="birthMonth" class="form-control birthMonth" required>
        <option>Month</option>
        <option>January</option>
        <option>February</option>
        <option>March</option>
        <option>April</option>
        <option>May</option>
        <option>June</option>
        <option>July</option>
        <option>August</option>
        <option>September</option>
        <option>October</option>
        <option>November</option>
        <option>December</option>
      </select>
      <select name="birthDate" class="form-control birthDate" required>
        <option>Day</option>
        ${day()}
      </select>
      <select name="birthYear" class="form-control" required>
        <option>Year</option>
        ${year()}
      </select>
    </div>
  </div>
`
const countryList = `
  <div class="form-group col-md-4 col-md-offset-4" style="padding-left: 0">
    <select name="countryName" class="form-control" onchange="handleCountrySelection()" required>
      <option selected disabled>Country</option>
    </select>
  </div>
`
const stateList = `
  <div class="form-group col-md-4 col-md-offset-4" style="padding-left: 0">
    <select name="stateName" class="form-control" onchange="handleStateSelection()">
      <option selected disabled>State</option>
    </select>
  </div>
`
const cityList = `
  <div class="form-group col-md-4 col-md-offset-4" style="padding-left: 0">
    <select name="cityName" class="form-control" onchange="handleCitySelection()" required>
      <option selected disabled>City</option>
    </select>
  </div>
`

const doneButton = `
  <div class="row" id="sectionSeparator">
    <div class="col-md-4 col-md-offset-4 text-center">
      <button name="submitButton" onclick="handleDone(event)" class="btn btn-success" id="submitButton">
        Done!  Let's do this!
      </button>
    </div>
  </div>
`

const aboutForm = `
  <form name="about">
    ${genderSelection}
    ${dob}
    ${countryList}
    ${stateList}
    ${cityList}
    ${doneButton}
  </form>
`
const lineBreak = `<div><hr style="width: 50%" /></div>`

const handleDone = event => {
  event.preventDefault()
  const userId = Cookies.get("userId")

  const usersAboutInfo = document.forms.about
  // const userRegistrationForm = {
  //   name: registrationForm.elements.name.value,
  //   email: registrationForm.elements.email.value,
  //   password: registrationForm.elements.password.value,
  //   gender: registrationForm.elements.gender.value,
  //   birthMonth: registrationForm.elements.birthMonth.value,
  //   birthDate: registrationForm.elements.birthDate.value,
  //   birthYear: registrationForm.elements.birthYear.value,
  // }

  const data = {
    userId,
    countrySelection,
    stateSelection,
    citySelection,
  }

  axios.post('/register/api/about', { data })
  .then(res => {
    if (res.status === 201) {
      // const success = document.createElement('div')
      // const container = document.getElementById('my-app')
      // success.setAttribute('id', 'registrationSuccessful')
      // success.classList.add("alert")
      // success.classList.add("alert-success")
      // success.innerHTML = '<h4>You have successfully registered!  You are now being redirected to the login screen.</h4>'
      // success.style.color = 'green';
      // success.style.width = '100%';
      // success.style.height = 'auto';
      // success.style.textAlign = 'center';
      // container.before(success)
      setTimeout(() => {
        // window.location.pathname = '/login'
      }, 3000)
    }
  })
  .catch(error => {
    console.log("error\n", error)
  })
}

window.addEventListener('load', () => {
  if (window.location.pathname === '/register/about') {
    getAllCountries()
    const profileAboutPage = layout + almostDone + title + aboutForm

    document.getElementById('my-app').innerHTML = profileAboutPage;
    Object.assign(document.getElementById('copy').style, titleStyle)

    document.forms.about.elements.submitButton.disabled = true
    countrySelected = document.forms.about.elements.countryName
    stateSelected = document.forms.about.elements.stateName
    citySelected = document.forms.about.elements.cityName

    stateSelected.style.display = 'none'
  }
})
