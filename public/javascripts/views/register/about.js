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
    let countryName = `
      <div class="registrationContainer">
        <form name="about">
          <div class="form-group col-md-4 col-md-offset-4" style="padding-left: 0">
            <select name="birthMonth" class="form-control" required>
              <option>Country</option>
    `

    Promise.all([
      axios.get('/register/api/country-list'),
      axios.get('/register/api/state-list')
    ])
    .then(([country, state]) => {
      country.data.map(country => {
        countryName += `<option>${country.name}</option>`
      })
      // console.log("state.data\n", state.data)
      countryName += `
        </select>
            </div>
            <div class="row">
              <div class="col-md-4 col-md-offset-4 text-center">
                <button onclick="handleSignUp(event)" class="btn btn-success" name="signUpButton">
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
      `
      const profileAboutPage = layout + almostDone + title + countryName
      document.getElementById('my-app').innerHTML = profileAboutPage;
      Object.assign(document.getElementById('copy').style, titleStyle)
    })
  }
})
