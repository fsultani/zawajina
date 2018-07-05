almostDone = `<center><h2>Sweet!  Almost done</h2></center>`

titleStyle = {
  'font-size': '16px',
  'color': '#727272',
  'text-align': 'center',
}

title = `
  <div id="copy">
    <p>
      To help match you with the right type of people, please answer a few questions.
    </p>
    <p>
      We promise it won't take long.
    </p>
  </div>
`

window.addEventListener('load', () => {
  if (window.location.pathname === '/register/about') {
    let countryList = `
      <div>
        <form name="countryForm">
          <div class="form-group col-md-4 col-md-offset-4" style="padding-left: 0">
            <select name="countryName" class="form-control" required>
              <option selected disabled>Country</option>
    `
    let stateList = `
      <div>
        <form name="stateForm">
          <div class="form-group col-md-4 col-md-offset-4" style="padding-left: 0">
            <select name="stateName" class="form-control" required>
              <option selected disabled>State/Region</option>
            </select>
          </div>
        </form>
      </div>
    `
    let cityList = `
      <div>
        <form name="cityForm">
          <div class="form-group col-md-4 col-md-offset-4" style="padding-left: 0">
            <select name="cityName" class="form-control" required>
              <option selected disabled>City</option>
            </select>
          </div>
        </form>
      </div>
    `


    axios.get('/register/api/all-countries')
    .then(country => {
      country.data.map(country => {
        countryList += `<option value="${country.id}">${country.name}</option>`
      })
      countryList += `
        </select></div></form></div>
      `
      let profileAboutPage = layout + almostDone + title + countryList + stateList + cityList
      document.getElementById('my-app').innerHTML = profileAboutPage;
      Object.assign(document.getElementById('copy').style, titleStyle)

      const countrySelected = document.forms.countryForm.elements.countryName
      const stateSelected = document.forms.stateForm.elements.stateName
      const citySelected = document.forms.cityForm.elements.cityName

      stateSelected.style.display = 'none'

      countrySelected.onchange = () => {
        stateSelected.options.length = 1
        citySelected.options.length = 1

        if (countrySelected.value === '231') {
          stateSelected.style.display = 'block'
          axios.get('/register/api/state-list?country=231')
          .then(state => {
            state.data.map(state => {
              stateSelected.options[stateSelected.options.length] = new Option(state.name, state.id)
            })
            stateSelected.onchange = () => {
              citySelected.options.length = 1

              axios.get(`/register/api/city-list?city=${stateSelected.value}`)
              .then(city => {
                city.data.map(city => {
                  citySelected.options[citySelected.options.length] = new Option(city.name, city.id)
                })
              })
            }
          })
        } else {
          axios.get(`/register/api/state-list?country=${countrySelected.value}`)
          .then(state => {
            state.data.map(state => {
              citySelected.options[citySelected.options.length] = new Option(state.name, state.id)
            })
          })
        }
      }
    })
  }
})
