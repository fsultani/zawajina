import {
  handleNameError,
  handleEmailError,
  handlePasswordErrorOnBlur,
} from './index.js';

export default (() => {
  // document.getElementById('signUpButton').addEventListener('click', () => {
  //   event.preventDefault()
  //   handleNameError()
  //   handleEmailError()
  //   handlePasswordErrorOnBlur()
  //   if (document.getElementById('registrationError')) {
  //     document.getElementById('registrationError').remove()
  //   } else if (document.getElementById('errors')) {
  //     document.getElementById('errors').remove()
  //   }

  //   const registrationForm = document.forms.registration
  //   const userRegistrationForm = {
  //     name: registrationForm.elements.name.value,
  //     email: registrationForm.elements.email.value,
  //     password: registrationForm.elements.password.value,
  //     gender: registrationForm.elements.gender.value,
  //     birthMonth: registrationForm.elements.birthMonth.value,
  //     birthDate: registrationForm.elements.birthDate.value,
  //     birthYear: registrationForm.elements.birthYear.value,
  //   }
  //   console.log("userRegistrationForm\n", userRegistrationForm)

  //   axios.post('/register/api/personal-info', { userRegistrationForm })
  //   .then(res => {
  //     if (!res.data.error) {
  //       for (var element in registrationForm.elements) {
  //         registrationForm.elements[element].disabled = true
  //       }
  //       Cookies.set('userId', res.data.userId)
  //       window.location.pathname = '/register/about'
  //     } else {
  //       const error = document.createElement('div')
  //       error.setAttribute('id', 'registrationError')
  //       error.classList.add("alert")
  //       error.classList.add("alert-danger")
  //       error.innerHTML = 'Email already exists'
  //       error.style.width = '100%';
  //       error.style.height = 'auto';
  //       error.style.textAlign = 'center';
  //       const container = document.getElementById('my-app')
  //       container.before(error)
  //     }
  //   })
  //   .catch(error => {
  //     console.log("error\n", error)
  //     const errors = document.createElement('div')
  //     errors.setAttribute('id', 'errors')
  //     const errorMessagesArray = error.response.data.error.map(err => {
  //       return `<p>${err.msg}</p>`
  //     })
  //     errors.innerHTML = errorMessagesArray.join('')
  //     errors.style.color = 'red';
  //     errors.style.width = '100%';
  //     errors.style.height = 'auto';
  //     errors.style.textAlign = 'center';
  //     const container = document.getElementById('registrationContainerDiv').parentNode
  //     container.insertBefore(errors, document.getElementById('registrationContainerDiv'))
  //   })
  // })
})
