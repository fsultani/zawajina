'use strict';

let countrySelected
let stateSelected
let citySelected

let countrySelection
let stateSelection
let citySelection

const almostDone = `<center><h2>Sweet!  Almost done</h2></center>`

const titleStyle = {
  'font-size': '16px',
  'color': '#727272',
  'text-align': 'center',
}

const title = `
  <div id="copy">
    <p>
      To help match you with the right type of people, please answer a few questions.
    </p>
    <p>
      We promise it won't take long.
    </p>
  </div>
`

const countryList = `
  <div>
    <form name="countryForm">
      <div class="form-group col-md-4 col-md-offset-4" style="padding-left: 0">
        <select name="countryName" class="form-control" onchange="handleCountrySelection()" required>
          <option selected disabled>Country</option>
        </select>
      </div>
    </form>
  </div>
`
const stateList = `
  <div>
    <form name="stateForm">
      <div class="form-group col-md-4 col-md-offset-4" style="padding-left: 0">
        <select name="stateName" class="form-control" onchange="handleStateSelection()">
          <option selected disabled>State</option>
        </select>
      </div>
    </form>
  </div>
`
const cityList = `
  <div>
    <form name="cityForm">
      <div class="form-group col-md-4 col-md-offset-4" style="padding-left: 0">
        <select name="cityName" class="form-control" onchange="handleCitySelection()" required>
          <option selected disabled>City</option>
        </select>
      </div>
    </form>
  </div>
`

const doneButton = `
  <div class="row">
    <div class="col-md-4 col-md-offset-4 text-center">
      <button onclick="handleDone(event)" class="btn btn-success" id="submitButton">
        Done!  Let's do this!
      </button>
    </div>
  </div>
`

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

const handleDone = event => {
  event.preventDefault()
  const userId = Cookies.get("userId")

  const data = {
    userId,
    countrySelection,
    stateSelection,
    citySelection,
  }

  axios.post('/register/api/about', { data })
  .then(res => {
    console.log("res.data\n", res.data)
    if (res.status === 201) {
      const success = document.createElement('div')
      const container = document.getElementById('my-app')
      success.setAttribute('id', 'registrationSuccessful')
      success.classList.add("alert")
      success.classList.add("alert-success")
      success.innerHTML = '<h4>You have successfully registered!  You are now being redirected to the login screen.</h4>'
      success.style.color = 'green';
      success.style.width = '100%';
      success.style.height = 'auto';
      success.style.textAlign = 'center';
      container.before(success)
      setTimeout(() => {
        console.log("Go to login")
        window.location.pathname = '/login'
      }, 3000)
    }
      // const error = document.createElement('div')
      // error.setAttribute('id', 'registrationError')
      // error.classList.add("alert")
      // error.classList.add("alert-danger")
      // error.innerHTML = 'Email already exists'
      // error.style.width = '100%';
      // error.style.height = 'auto';
      // error.style.textAlign = 'center';
      // const container = document.getElementById('my-app')
      // container.before(error)
  })
  .catch(error => {
    console.log("error\n", error)
    // const errors = document.createElement('div')
    // errors.setAttribute('id', 'errors')
    // const errorMessagesArray = error.response.data.error.map(err => {
    //   return `<p>${err.msg}</p>`
    // })
    // errors.innerHTML = errorMessagesArray.join('')
    // errors.style.color = 'red';
    // errors.style.width = '100%';
    // errors.style.height = 'auto';
    // errors.style.textAlign = 'center';
    // const container = document.getElementById('registrationContainerDiv').parentNode
    // container.insertBefore(errors, document.getElementById('registrationContainerDiv'))
  })
}

window.addEventListener('load', () => {
  if (window.location.pathname === '/register/about') {
    const profileAboutPage = layout + almostDone + title + countryList + stateList + cityList + doneButton
    document.getElementById('my-app').innerHTML = profileAboutPage;
    Object.assign(document.getElementById('copy').style, titleStyle)

    document.getElementById('submitButton').disabled = true
    countrySelected = document.forms.countryForm.elements.countryName
    stateSelected = document.forms.stateForm.elements.stateName
    citySelected = document.forms.cityForm.elements.cityName
    stateSelected.style.display = 'none'
    getAllCountries()

  }
})
