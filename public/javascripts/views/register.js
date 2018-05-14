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

const blurOut = () => {
  console.log("You left!")
  document.forms.registration.elements.first_name.style.border = '2px solid red'
  document.body.insertAdjacentHTML('afterbegin', '<h5 align="center">Enter your name</h5>')
}

const handleSignUp = event => {
  event.preventDefault()
  if (!registrationForm.elements.first_name.checkValidity()) {
    registrationForm.elements.first_name.style.border = '2px solid red'
  }
  const userRegistrationForm = {
    first_name: registrationForm.elements.first_name.value,
    email: registrationForm.elements.email.value,
    password: registrationForm.elements.password.value,
    gender: registrationForm.elements.gender.value,
    birthMonth: registrationForm.elements.birthMonth.value,
    birthDate: registrationForm.elements.birthDate.value,
    birthYear: registrationForm.elements.birthYear.value,
  }
  axios.post('/register', {
    userRegistrationForm
  })
  .then(res => {
    console.log("res\n", res)
  })
}

register = `
  <div class="registrationContainer centerContainer">
    <form name="registration">
      <div class="form-group">
        <input
          type="text"
          class="form-control"
          placeholder="First Name"
          name="first_name"
          required
        >
        <label align="center">Enter your name</label>
      </div>

       <div class="form-group">
        <input
          type="email"
          class="form-control"
          placeholder="Email"
          name="email"
          required
        >
      </div>

      <div class="form-group">
        <input
          type="password"
          class="form-control"
          placeholder="Password"
          name="password"
        >
      </div>

      <div class="col-half">
        <h5>Gender</h5>
        <div class="gender-input-group">
          <input id="male" type="radio" name="gender" value="male">
          <label for="male">Male</label>
          <input id="female" type="radio" name="gender" value="female">
          <label for="female">Female</label>
        </div>
      </div>

      <div>
        <div>Date of Birth</div>
        <div class="form-group col-md-4" style="padding-left: 0">
          <select name="birthMonth" class="form-control">
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
        </div>
        <div class="form-group col-md-4">
          <select name="birthDate" class="form-control">
            <option>Day</option>
            ${day()}
          </select>
        </div>
        <div class="form-group col-md-4">
          <select name="birthYear" class="form-control">
            <option>Year</option>
            ${year()}
          </select>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 col-md-offset-4 text-center">
          <button onclick="handleSignUp(event)" class="btn btn-success">
            Sign Up
          </button>
        </div>
      </div>
    </form>
  </div>
`;

const registrationPage = layout + register

window.addEventListener('load', () => {
  if (window.location.pathname === '/register') {
    document.getElementById('my-app').innerHTML = registrationPage;
    document.forms.registration.elements.first_name.addEventListener("blur", blurOut)
  }
})
