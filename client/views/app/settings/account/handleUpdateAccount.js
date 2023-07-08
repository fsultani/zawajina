let nameError = false;
let emailError = false;
let nameErrorMessage = '';
let emailErrorMessage = '';

const handleNameValidation = name => {
  const invalidCharacters = /[0-9!@#$%^&*()_\+=[\]{}|:;"<,>\?\/\\~`]/g;
  const invalidName = invalidCharacters.test(name);
  addErrorClass('#name')

  if (name.length === 0) {
    nameErrorMessage = '<p>Name cannot be blank</p>';
    nameError = true;
  } else if (invalidName) {
    nameErrorMessage = '<p>Name cannot contain numbers or special characters</p>';
    nameError = true;
  } else {
    nameErrorMessage = '';
    removeErrorClass('#name')
    nameError = false;
  }
};

const handleEmailValidation = email => {
  if (email.length === 0) {
    emailErrorMessage += '<p>Email cannot be blank</p>';
    addErrorClass('#email')
    emailError = true;
  } else {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  
    if (!emailRegex.test(email)) {
      emailErrorMessage += '<p>Email format must be valid</p>';
      addErrorClass('#email')
      emailError = true;
    } else {
      emailErrorMessage += '';
      removeErrorClass('#email')
      emailError = false;
    }
  }
};

const handleUpdateAccount = async event => {
  event.preventDefault();
  const name = getQuerySelector('#name').value;
  const email = getQuerySelector('#email').value;

  handleNameValidation(name);
  handleEmailValidation(email);

  if (nameError) {
    const nameErrorTextElement = getQuerySelector('#name-error-text');
    nameErrorTextElement.innerHTML = nameErrorMessage;
    nameErrorTextElement.style.display = 'block';
  }

  if (emailError) {
    const emailErrorTextElement = getQuerySelector('#email-error-text');
    emailErrorTextElement.innerHTML = emailErrorMessage;
    emailErrorTextElement.style.display = 'block';
  }

  if (!nameError && !emailError) {
    isSubmitting('form-submit-account-loading-spinner-wrapper', true);

    try {
      const { data } = await Axios({
        method: 'put',
        apiUrl: '/api/settings/account', // server/routes/settings/api/account.js
        params: {
          name,
          email,
        }
      });

      isSubmitting('form-submit-account-loading-spinner-wrapper', false);
      toast('success', 'Account successfully updated!');
      const nameValue = data.name;
      const emailValue = data.email;

      getQuerySelector('#name').value = nameValue;
      getQuerySelector('#email').value = emailValue;
    } catch {
      isSubmitting('form-submit-account-loading-spinner-wrapper', false);
      toast('error', 'There was an error');
    }
  }
}

const handleDeactivateAccountModal = () => {
  const modalHeader = 'Deactivate account';
  const modalBody = '<h3>Confirm that you want to deactivate your account.</h3>'
  const modalButton = 'Confirm';

  showModal({
    modalHeader,
    modalBody,
    modalButton,
    submitFormCallback: async () => {
      try {
        await Axios({
          method: 'put',
          apiUrl: '/api/settings/account/status', // server/routes/settings/api/account.js
          params: {
            accountStatus: 'inactive',
          }
        });

        handleLogout();
      } catch {
        isSubmitting('modal-button-loading-spinner-wrapper', false);
        toast('error', 'There was an error');
      }
    }
  }
  );
}

const handleDeleteAccountModal = () => {
  const modalHeader = 'Delete account';
  const modalBody = `
    <h3>Confirm that you want to delete your account.</h3>
    <h3>This action is <strong><em>not</em></strong> reversible.</h3>
  `
  const modalButton = 'Delete Account';
  showModal({
    modalHeader,
    modalBody,
    modalButton,
    customStyles: [
      {
        element: '.modal-header',
        style: {
          color: '#ff3232',
        }
      },
      {
        element: '.modal-button',
        style: {
          backgroundColor: '#ff3232',
        }
      },
    ],
    submitFormCallback: async () => {
      try {
        await Axios({
          method: 'put',
          apiUrl: '/api/settings/account/status', // server/routes/settings/api/account.js
          params: {
            accountStatus: 'deleted',
          }
        });

        handleLogout();
      } catch {
        isSubmitting('modal-button-loading-spinner-wrapper', false);
        toast('error', 'There was an error');
      }
    }
  });
}
