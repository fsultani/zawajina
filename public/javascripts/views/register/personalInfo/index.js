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

// const handleSignUp = event => {
//   event.preventDefault()
//   console.log("handleSignUp")
// }

const personalInfo = `
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
          <button onclick="handleSignUp(event)" class="btn btn-success" name="signUpButton">
            Sign Up
          </button>
        </div>
      </div>
    </form>
  </div>
`;

export {
  handleNameError,
  handleEmailError,
  handlePasswordErrorOnBlur,
  handlePasswordErrorOnKeyUp,
  isPasswordValid,
  // handleSignUp,
  personalInfo
}