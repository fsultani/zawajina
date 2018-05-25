const handleNameError = () => {
  if (!document.forms.registration.elements.name.checkValidity()) {
    document.forms.registration.elements.name.style.border = '2px solid red'
    const firstNameError = document.createElement('div')
    firstNameError.setAttribute('id', 'firstNameError')
    firstNameError.textContent = 'Please enter your name';
    firstNameError.style.color = 'red';
    firstNameError.style.width = '100%';
    firstNameError.style.height = 'auto';
    firstNameError.style.textAlign = 'center';
    const container = document.getElementById('name')
    if (!document.getElementById('firstNameError')) {
      container.appendChild(firstNameError)
    }
  } else if (document.getElementById('firstNameError')) {
    document.getElementById('firstNameError').remove()
    document.forms.registration.elements.name.style.border = '1px solid #ccc'
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

const handlePasswordErrorOnBlur = () => {
  if (
    !document.forms.registration.elements.password.checkValidity()
  ) {
    document.forms.registration.elements.password.style.border = '2px solid red'
  } else if (
    document.forms.registration.elements.password.checkValidity() &&
    document.forms.registration.elements.password.value.length < 8
  ) {
    document.forms.registration.elements.password.style.border = '2px solid red'
  }
}

const handlePasswordErrorOnKeyUp = () => {
  if (
    document.forms.registration.elements.password.checkValidity() &&
    document.forms.registration.elements.password.value.length >= 8
  ) {
    document.getElementById('greenCheckMark').style.display = 'inline-block'
    document.forms.registration.elements.password.style.border = '1px solid #ccc'
  } else if (
    document.forms.registration.elements.password.checkValidity() &&
    document.forms.registration.elements.password.value.length < 8 &&
    document.forms.registration.elements.password.style.border !== '2px solid red'
  ) {
    document.getElementById('greenCheckMark').style.display = 'none'
  } else if (
    !document.forms.registration.elements.password.checkValidity()
  ) {
    document.getElementById('greenCheckMark').style.display = 'none'
  }
}

const isPasswordValid = () => {
  return document.forms.registration.elements.password.value.length >= 8
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
  handleNameError()
  handleEmailError()
  handlePasswordErrorOnBlur()

  const registrationForm = document.forms.registration
  const userRegistrationForm = {
    name: registrationForm.elements.name.value,
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
      <div class="form-group" id="name">
        <input
          type="text"
          class="form-control"
          placeholder="John Doe"
          name="name"
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

      <div class="form-group" style="position: relative" id="password">
        <input
          type="password"
          class="form-control"
          placeholder="********"
          name="password"
          required
        >
        <div id="greenCheckMark" style="position: absolute; top: 7px; right: 10px">
          <i class="fa fa-check" style="color: #22dd22; font-size: 14px"></i>
        </div>
        <div id="passwordInfo" style="font-size: 12px; margin-top: 5px;">
          Your password needs at least 8 characters
        </div>
      </div>

      <div class="col-half">
        <h5>Gender</h5>
        <div class="gender-input-group">
          <input
            id="male"
            type="radio"
            name="gender"
            value="male"
          >
          <label for="male">Male</label>
          <input
            id="female"
            type="radio"
            name="gender"
            value="female"
          >
          <label for="female">Female</label>
        </div>
      </div>

      <div>
        <div>Date of Birth</div>
        <div class="form-group col-md-4" style="padding-left: 0">
          <select name="birthMonth" class="form-control" required>
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
          <select name="birthDate" class="form-control" required>
            <option>Day</option>
            ${day()}
          </select>
        </div>
        <div class="form-group col-md-4">
          <select name="birthYear" class="form-control" required>
            <option>Year</option>
            ${year()}
          </select>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 col-md-offset-4 text-center">
          <button onclick="handleSignUp(event)" class="btn btn-success" id="handleSignUp">
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
  const registrationFormElement = document.forms.registration.elements
  registrationFormElement.handleSignUp.disabled = true
  document.getElementById('greenCheckMark').style.display = 'none'

  let nameEmailPassword = document.querySelectorAll("[name='name'], [name='email'], [name='password']")
  let genderButtons = document.querySelectorAll("input[type='radio']")
  let DOB = document.querySelectorAll("[name='birthMonth'], [name='birthDate'], [name='birthYear']")
  for (let i = 0; i < nameEmailPassword.length; i++) {
    nameEmailPassword[i].onkeyup = () => {
      if (
        registrationFormElement.name.checkValidity() &&
        registrationFormElement.email.checkValidity() &&
        isPasswordValid()
      ) {
        if (
          registrationFormElement.male.checked ||
          registrationFormElement.female.checked
        ) {
          registrationFormElement.handleSignUp.disabled = false
        } else {
          for (let i = 0; i < genderButtons.length; i++) {
            genderButtons[i].onchange = () => {
              if (
                registrationFormElement.male.checked ||
                registrationFormElement.female.checked
              ) {
                for (let i = 0; i < DOB.length; i++) {
                  DOB[i].onchange = () => {
                    if (
                      registrationFormElement.birthMonth.value !== 'Month' &&
                      registrationFormElement.birthDate.value !== 'Day' &&
                      registrationFormElement.birthYear.value !== 'Year'
                    ) {
                      registrationFormElement.handleSignUp.disabled = false
                    } else {
                      registrationFormElement.handleSignUp.disabled = true
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        registrationFormElement.handleSignUp.disabled = true
      }
    }
  }

  registrationFormElement.name.addEventListener("blur", handleNameError)
  registrationFormElement.email.addEventListener("blur", handleEmailError)
  registrationFormElement.password.addEventListener("blur", handlePasswordErrorOnBlur)
  registrationFormElement.password.addEventListener("keyup", handlePasswordErrorOnKeyUp)
  registrationFormElement.password.addEventListener("keyup", isPasswordValid)
}
})
