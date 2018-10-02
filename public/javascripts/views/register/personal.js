const handleNameError = () => {
  if (!document.forms.registration.elements.name.checkValidity()) {
    document.forms.registration.elements.name.style.border = '2px solid red'
    const nameError = document.createElement('div')
    nameError.setAttribute('id', 'nameError')
    nameError.textContent = 'Please enter your name';
    nameError.style.color = 'red';
    nameError.style.width = '100%';
    nameError.style.height = 'auto';
    nameError.style.textAlign = 'center';
    const container = document.getElementById('name')
    if (!document.getElementById('nameError')) {
      container.appendChild(nameError)
    }
  } else if (document.getElementById('nameError')) {
    document.getElementById('nameIsValid').style.display = 'inline-block'
    document.getElementById('nameError').remove()
    document.forms.registration.elements.name.style.border = '1px solid #ccc'
  } else if (document.forms.registration.elements.name.checkValidity()){
    document.getElementById('nameIsValid').style.display = 'inline-block'
  }
}

const handleEmailError = () => {
  if (!document.forms.registration.elements.email.checkValidity()) {
    document.forms.registration.elements.email.style.border = '2px solid red'
    const emailError = document.createElement('div')
    emailError.setAttribute('id', 'emailError')
    emailError.textContent = 'Please enter a valid email address';
    emailError.style.color = 'red';
    emailError.style.width = '100%';
    emailError.style.height = 'auto';
    emailError.style.textAlign = 'center';
    const container = document.getElementById('email')
    if (!document.getElementById('emailError')) {
      container.appendChild(emailError)
    }
  } else if (document.getElementById('emailError')) {
    document.getElementById('emailIsValid').style.display = 'inline-block'
    document.getElementById('emailError').remove()
    document.forms.registration.elements.email.style.border = '1px solid #ccc'
  } else if (document.forms.registration.elements.email.checkValidity()) {
    document.getElementById('emailIsValid').style.display = 'inline-block'
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
    document.getElementById('passwordIsValid').style.display = 'inline-block'
    document.forms.registration.elements.password.style.border = '1px solid #ccc'
  } else if (
    document.forms.registration.elements.password.checkValidity() &&
    document.forms.registration.elements.password.value.length < 8 &&
    document.forms.registration.elements.password.style.border !== '2px solid red'
  ) {
    document.getElementById('passwordIsValid').style.display = 'none'
  } else if (
    !document.forms.registration.elements.password.checkValidity()
  ) {
    document.getElementById('passwordIsValid').style.display = 'none'
  }
}

const isPasswordValid = () => {
  return document.forms.registration.elements.password.value.length >= 8
}

const handleSignUp = event => {
  event.preventDefault()
  handleNameError()
  handleEmailError()
  handlePasswordErrorOnBlur()
  if (document.getElementById('registrationError')) {
    document.getElementById('registrationError').remove()
  } else if (document.getElementById('errors')) {
    document.getElementById('errors').remove()
  }

  const registrationForm = document.forms.registration
  const userRegistrationForm = {
    name: registrationForm.elements.name.value,
    email: registrationForm.elements.email.value,
    password: registrationForm.elements.password.value,
    // gender: registrationForm.elements.gender.value,
    // birthMonth: registrationForm.elements.birthMonth.value,
    // birthDate: registrationForm.elements.birthDate.value,
    // birthYear: registrationForm.elements.birthYear.value,
  }
  axios.post('/register/api/personal-info', { userRegistrationForm })
  .then(res => {
    if (!res.data.error) {
      for (var element in registrationForm.elements) {
        registrationForm.elements[element].disabled = true
      }
      Cookies.set('userId', res.data.userId)
      window.location.pathname = '/register/about'
    } else {
      const error = document.createElement('div')
      error.setAttribute('id', 'registrationError')
      error.classList.add("alert")
      error.classList.add("alert-danger")
      error.innerHTML = 'Email already exists'
      error.style.width = '100%';
      error.style.height = 'auto';
      error.style.textAlign = 'center';
      const container = document.getElementById('my-app')
      container.before(error)
    }
  })
  .catch(error => {
    const errors = document.createElement('div')
    errors.setAttribute('id', 'errors')
    const errorMessagesArray = error.response.data.error.map(err => {
      return `<p>${err.msg}</p>`
    })
    errors.innerHTML = errorMessagesArray.join('')
    errors.style.color = 'red';
    errors.style.width = '100%';
    errors.style.height = 'auto';
    errors.style.textAlign = 'center';
    const container = document.getElementById('registrationContainerDiv').parentNode
    container.insertBefore(errors, document.getElementById('registrationContainerDiv'))
  })
}

register = `
  <div class="registrationContainer centerContainer" id="registrationContainerDiv">
    <form name="registration">
      <div class="form-group" style="position: relative" id="name">
        <input
          type="text"
          class="form-control"
          placeholder="John"
          name="name"
          required
        >
        <div id="nameIsValid" style="position: absolute; top: 7px; right: 10px">
          <i class="fa fa-check" style="color: #22dd22; font-size: 14px"></i>
        </div>
      </div>

      <div class="form-group" style="position: relative" id="email">
        <input
          type="email"
          class="form-control"
          placeholder="john@example.com"
          name="email"
          required
        >
        <div id="emailIsValid" style="position: absolute; top: 7px; right: 10px">
          <i class="fa fa-check" style="color: #22dd22; font-size: 14px"></i>
        </div>
      </div>

      <div class="form-group" style="position: relative" id="password">
        <input
          type="password"
          class="form-control"
          placeholder="********"
          name="password"
          required
        >
        <div id="passwordIsValid" style="position: absolute; top: 7px; right: 10px">
          <i class="fa fa-check" style="color: #22dd22; font-size: 14px"></i>
        </div>
        <div id="passwordInfo" style="font-size: 12px; margin-top: 5px;">
          Your password needs at least 8 characters
        </div>
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
`;

const registrationPage = layout + register

window.addEventListener('load', () => {
  if (window.location.pathname === '/register') {
    document.getElementById('my-app').innerHTML = registrationPage;
    const registrationFormElement = document.forms.registration.elements

    registrationFormElement.signUpButton.disabled = true
    document.getElementById('passwordIsValid').style.display = 'none'
    document.getElementById('nameIsValid').style.display = 'none'
    document.getElementById('emailIsValid').style.display = 'none'

    let nameEmailPassword = document.querySelectorAll("[name='name'], [name='email'], [name='password']")
    for (let i = 0; i < nameEmailPassword.length; i++) {
      nameEmailPassword[i].onkeyup = () => {
        if (
          registrationFormElement.name.checkValidity() &&
          registrationFormElement.email.checkValidity() &&
          isPasswordValid()
        ) {
          registrationFormElement.signUpButton.disabled = false
        } else {
          registrationFormElement.signUpButton.disabled = true
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
