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
  citySelected.options.length = 1

  // U.S. states
  if (countrySelected.value === '231') {
    stateSelected.style.display = 'block'
    axios.get('/register/api/state-list?country=231')
    .then(state => {
      state.data.map(state => {
        stateSelected.options[stateSelected.options.length] = new Option(state.name, state.id)
      })
    })
  } else {
    // Non U.S. cities
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
  citySelected.options.length = 1

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
  const res = [...Array(31)].map((_, i) => dayOptions.push(`<option>${i+1}</option>`))
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
        <option selected disabled>Month</option>
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
        <option selected disabled>Day</option>
        ${day()}
      </select>
      <select name="birthYear" class="form-control" required>
        <option selected disabled>Year</option>
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

const ethnicity = `
  <div class="form-group col-md-4 col-md-offset-4" style="padding-left: 0">
    <select name="ethnicity" class="form-control" required>
      <option selected disabled>Family Background</option>
        <optgroup label="Central Asian">
          <option>Afghan</option>
          <option>Armenian</option>
          <option>Azerbaijani</option>
          <option>Georgian</option>
          <option>Kazakh</option>
          <option>Mongolian</option>
          <option>Tajik</option>
          <option>Turkmen</option>
          <option>Uzbek</option>
        </optgroup>

        <optgroup label="East Asian">
          <option>Chinese</option>
          <option>Japanese</option>
          <option>Korean</option>
          <option>Okinawan</option>
          <option>Taiwanese</option>
          <option>Tibetan</option>
        </optgroup>

        <optgroup label="Native Hawaiian/Pacific Islander">
          <option>Carolinian</option>
          <option>Chamorro</option>
          <option>Chuukese</option>
          <option>Fijian</option>
          <option>Guamanian</option>
          <option>Hawaiian</option>
          <option>Kosraean</option>
          <option>Marshallesse</option>
          <option>Niuean</option>
          <option>Palauan</option>
          <option>Pohnpeian</option>
          <option>Samoan</option>
          <option>Tokelauan</option>
          <option>Tongan</option>
          <option>Yapese</option>
        </optgroup>

        <optgroup label="Southeast Asian">
          <option>Bruneian</option>
          <option>Burmese</option>
          <option>Cambodian</option>
          <option>Filipino</option>
          <option>Hmong</option>
          <option>Indonesian</option>
          <option>Laotian</option>
          <option>Malaysian</option>
          <option>Mien</option>
          <option>Papua</option>
          <option>New Guinean</option>
          <option>Singaporean</option>
          <option>Timorese</option>
          <option>Thai</option>
          <option>Vietnamese</option>
        </optgroup>

        <optgroup label="South Asian">
          <option>Bangladeshi</option>
          <option>Bhutanese</option>
          <option>Indian</option>
          <option>Maldivians</option>
          <option>Nepali</option>
          <option>Pakistani</option>
          <option>Sri Lankan</option>
        </optgroup>

        <optgroup label="Middle Eastern">
          <option>Bahrain</option>
          <option>Iran</option>
          <option>Iraq</option>
          <option>Israel</option>
          <option>Jordan</option>
          <option>Kuwait</option>
          <option>Lebanon</option>
          <option>Oman</option>
          <option>Palestine</option>
          <option>Qatar</option>
          <option>Saudi Arabia</option>
          <option>Syria</option>
          <option>Turkey</option>
          <option>United Arab Emirates</option>
          <option>Yemen</option>
        </optgroup>
      <option>Mixed</option>
      <option>Other</option>
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
    ${ethnicity}
    ${doneButton}
  </form>
`
const lineBreak = `<div><hr style="width: 50%" /></div>`

const handleDone = event => {
  event.preventDefault()
  const userId = Cookies.get("userId")

  const userAboutInfo = document.forms.about
  const usersInfo = {
    gender: userAboutInfo.elements.gender.value,
    birthMonth: userAboutInfo.elements.birthMonth.value,
    birthDate: userAboutInfo.elements.birthDate.value,
    birthYear: userAboutInfo.elements.birthYear.value,
    countrySelection,
    stateSelection,
    citySelection,
    ethnicity: userAboutInfo.elements.ethnicity.value
  }

  const data = {
    usersInfo,
    userId,
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
