const handleFirstNameError = () => {
  if (!document.forms.registration.elements.first_name.checkValidity()) {
    document.forms.registration.elements.first_name.style.border = '2px solid red'
    const firstNameError = document.createElement('div')
    firstNameError.setAttribute('id', 'firstNameError')
    firstNameError.textContent = 'Please enter your name';
    firstNameError.style.color = 'red';
    firstNameError.style.width = '100%';
    firstNameError.style.height = 'auto';
    firstNameError.style.textAlign = 'center';
    const container = document.getElementById('first_name')
    if (!document.getElementById('firstNameError')) {
      container.appendChild(firstNameError)
    }
  } else if (document.getElementById('firstNameError')) {
    document.getElementById('firstNameError').remove()
    document.forms.registration.elements.first_name.style.border = '1px solid #ccc'
  }
}

const handleEmailError = () => {
  if (!document.forms.registration.elements.email.checkValidity()) {  
    document.forms.registration.elements.email.style.border = '2px solid red'
    const emailError = document.createElement('div')
    emailError.setAttribute('id', 'emailError')
    emailError.textContent = 'Please a valid email address';
    emailError.style.color = 'red';
    emailError.style.width = '100%';
    emailError.style.height = 'auto';
    emailError.style.textAlign = 'center';
    const container = document.getElementById('email')
    if (!document.getElementById('emailError')) {
      container.appendChild(emailError)
    }
  } else if (document.getElementById('emailError')) {
    document.getElementById('emailError').remove()
    document.forms.registration.elements.email.style.border = '1px solid #ccc'
  }
}

const handlePasswordError = () => {
  if (!document.forms.registration.elements.password.checkValidity()) {
    document.forms.registration.elements.password.style.border = '2px solid red'
    const passwordError = document.createElement('div')
    passwordError.setAttribute('id', 'passwordError')
    passwordError.textContent = 'Password must be at least 8 characters';
    passwordError.style.color = 'red';
    passwordError.style.width = '100%';
    passwordError.style.height = 'auto';
    passwordError.style.textAlign = 'center';
    const container = document.getElementById('password')
    if (!document.getElementById('passwordError')) {
      container.appendChild(passwordError)
    }
  } else if (document.getElementById('passwordError')) {
    document.getElementById('passwordError').remove()
    document.forms.registration.elements.password.style.border = '1px solid #ccc'
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

const handleSignUp = event => {
  event.preventDefault()
  handleFirstNameError()
  handleEmailError()
  handlePasswordError()

  const registrationForm = document.forms.registration
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
      <div class="form-group" id="first_name">
        <input
          type="text"
          class="form-control"
          placeholder="John Doe"
          name="first_name"
          required
        >
      </div>

       <div class="form-group" id="email">
        <input
          type="email"
          class="form-control"
          placeholder="john@example.com"
          name="email"
          required
        >
      </div>

      <div class="form-group" id="password">
        <input
          type="password"
          class="form-control"
          placeholder="********"
          name="password"
          required
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
    // document.forms.registration.elements.first_name.addEventListener("blur", handleFirstNameError)
    document.forms.registration.elements.email.addEventListener("blur", handleEmailError)
    document.forms.registration.elements.password.addEventListener("blur", handlePasswordError)
  }
})
