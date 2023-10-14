const editPhotosModalIsSubmitting = (buttonId, value) => {
  const loader = document.getElementById(buttonId);
  Object.assign(loader.style, {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  })

  loader.innerHTML += `
    <div class='loader-child'></div>
    <div class='loader-child'></div>
    <div class='loader-child'></div>
    <div class='loader-child'></div>
  `;

  document.querySelectorAll('.loader-child').forEach((element, index) => {
    Object.assign(element.style, {
      boxSizing: 'border-box',
      display: value ? 'block' : 'none',
      position: 'absolute',
      width: '30px',
      height: '30px',
      margin: '8px',
      border: '3px solid #fff',
      borderRadius: '50%',
      animation:
        'animation-loading-spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
      borderColor: '#fff transparent transparent transparent',
      opacity: '1',
      zIndex: '999',
      animationDelay: index === 0 ? '-0.45s' : index === 1 ? '-0.3s' : index === 2 ? '-0.15s' : '',
    })
  })

  const formSubmitButton = loader.children[0];
  if (!buttonText) buttonText = formSubmitButton.innerHTML;

  formSubmitButton.innerHTML = value ? '' : buttonText;
  formSubmitButton.disabled = value;
  formSubmitButton.style.pointerEvents = value ? 'none' : 'auto';

  document.querySelectorAll('form *').forEach(item => {
    item.disabled = value;
    item.style.cursor = value ? 'not-allowed' : 'pointer';
  });
}

const handleSaveProfileChanges = async profileSection => {
  if (profileSection === 'photos') {
    const images = document.forms.namedItem('editPhotosForm');
    const userData = new FormData(images);

    let photos = [];
    Array(3).fill().map((_, index) => {
      const imagePreview = document.querySelector(`.image-preview-${index}`);
      photos.push({
        image: imagePreview?.src ?? 'undefined',
        index
      });
    });
    userData.append('photos', JSON.stringify(photos));

    editPhotosModalIsSubmitting('edit-photos-modal-submit-button-loading-spinner-wrapper', true);
    Axios({
      method: 'put',
      apiUrl: '/api/user/profile-details/photos', // server/routes/user/api.js
      params: userData
    })
      .then(({ status }) => {
        if (status === 200) toastOnPageReload('success', 'Account updated successfully!');
      })
      .catch(() => {
        editPhotosModalIsSubmitting('edit-photos-modal-submit-button-loading-spinner-wrapper', false);
        window.scroll({
          top: 0,
          behavior: 'smooth',
        });

        toast('error', 'There was an error');
        closeModal();
      });
  } else if (profileSection === 'location') {
    const locationData = document.querySelector('#locationInput').dataset;
    const city = locationData.city;

    if (!city) {
      closeAllLists('#locationInput');
      document.querySelector('#city-error').innerHTML = 'Please select your city from the dropdown';
      document.querySelector('#city-error').style.display = 'block';
    } else {
      document.querySelector('#city-error').style.display = 'none';

      isSubmitting('modal-button-loading-spinner-wrapper', true);
      Axios({
        method: 'put',
        apiUrl: '/api/user/profile-details/location', // server/routes/user/api.js
        params: locationData,
      })
        .then(({ data }) => {
          isSubmitting('modal-button-loading-spinner-wrapper', false);
          const authUser = data.response;

          const html = `
            Lives in
            <span id="user-city" data-city="${authUser.city}">${authUser.city}</span>,
            ${authUser.state !== null ? `<span id="user-state" data-state="${authUser.state}">${authUser.state}</span>, ` : ``}
            <span id="user-country" data-country="${authUser.country}">${authUser.country}</span>
          `;

          getQuerySelector('.user-location').innerHTML = html;
          closeModal();
          toast('success', 'Account updated successfully!');
        })
        .catch(() => {
          isSubmitting('modal-button-loading-spinner-wrapper', false);
          window.scroll({
            top: 0,
            behavior: 'smooth',
          });

          toast('error', 'There was an error');
        });
    }
  } else if (profileSection === 'user-details') {
    const userDetails = {
      religiousConviction,
      religiousValues,
      maritalStatus,
      education,
      profession,
      canRelocate,
      diet,
      smokes,
      hasChildren,
      wantsChildren,
      prayerLevel,
      hijab,
      userLanguages,
      userHobbies,
    }

    if (userLanguages.length === 0) {
      document.querySelector('#languages-error').innerHTML =
        'Please select your language from the dropdown';
      document.querySelector('#languages-error').style.display = 'block';
    } else {
      document.querySelector('#languages-error').style.display = 'none';

      isSubmitting('modal-button-loading-spinner-wrapper', true);
      Axios({
        method: 'put',
        apiUrl: '/api/user/profile-details/user-details', // server/routes/user/api.js
        params: userDetails,
      })
        .then(({ data }) => {
          isSubmitting('modal-button-loading-spinner-wrapper', false);
          const authUser = data.response;

          const html = `
            <div class="user-details-wrapper" data-name='edit-button' data-section="user-details">
              <h5 class="user-details-header">Details</h5>
              <div class="details-container">
                <div class="details-wrapper">
                  <span class="details-key">Ethnicity:</span>
                  <span class="details-value">${authUser.ethnicity.length > 0 ? authUser.ethnicity.map(ethnicity => ethnicity).join('&nbsp;<span>&#9679;</span>&nbsp;') : 'No Answer'}</span>
                </div>
                <div class="details-wrapper">
                  <span class="details-key">Raised in:</span>
                  <span class="details-value">${authUser.countryRaisedIn || 'No Answer'}</span>
                </div>
                <div class="details-wrapper">
                  <span class="details-key">Conviction:</span>
                  <span class="details-value">${authUser.religiousConviction || 'No Answer'}</span>
                </div>
                <div class="details-wrapper">
                  <span class="details-key">Values:</span>
                  <span class="details-value">${authUser.religiousValues || 'No Answer'}</span>
                </div>
                <div class="details-wrapper">
                  <span class="details-key">Marital Status:</span>
                  <span class="details-value">${authUser.maritalStatus || 'No Answer'}</span>
                </div>
                <div class="details-wrapper">
                  <span class="details-key">Education:</span>
                  <span class="details-value">${authUser.education || 'No Answer'}</span>
                </div>
                <div class="details-wrapper">
                  <span class="details-key">Profession:</span>
                  <span class="details-value">${authUser.profession || 'No Answer'}</span>
                </div>
                <div class="details-wrapper">
                  <span class="details-key">Languages:</span>
                  <span class="details-value">${authUser.languages.length > 0 ? authUser.languages.map(language => language).join('&nbsp;<span>&#9679;</span>&nbsp;') : 'No Answer'}</span>
                </div>
                <div class='details-wrapper'>
                  <span class='details-key'>Prayer Level:</span>
                  <span class='details-value'>${authUser.prayerLevel || 'No Answer'}</span>
                </div>
                ${authUser.gender === 'female' ? `
                  <div class="details-wrapper">
                    <span class="details-key">Hijab:</span>
                    <span class="details-value">${authUser.hijab || 'No Answer'}</span>
                  </div>
                  ` : ''
            }
                <div class="details-wrapper">
                  <span class="details-key">Has children:</span>
                  <span class="details-value">${authUser.hasChildren || 'No Answer'}</span>
                </div>
                <div class="details-wrapper">
                  <span class="details-key">Wants children:</span>
                  <span class="details-value">${authUser.wantsChildren || 'No Answer'}</span>
                </div>
                <div class="details-wrapper">
                  <span class="details-key">Height:</span>
                  <span class="details-value">${authUser.height || 'No Answer'}</span>
                </div>
                <div class="details-wrapper">
                  <span class="details-key">Can relocate:</span>
                  <span class="details-value">${authUser.canRelocate || 'No Answer'}</span>
                </div>
                <div class="details-wrapper">
                  <span class="details-key">Diet:</span>
                  <span class="details-value">${authUser.diet || 'No Answer'}</span>
                </div>
                <div class="details-wrapper">
                  <span class="details-key">Smokes:</span>
                  <span class="details-value">${authUser.smokes || 'No Answer'}</span>
                </div>
                <div class="details-wrapper">
                  <span class="details-key">Interests:</span>
                  <span class="details-value">${authUser.hobbies.length > 0 ? authUser.hobbies.map(hobby => hobby).join('&nbsp;<span>&#9679;</span>&nbsp;') : 'No Answer'}</span>
                </div>
              </div>

              <div class='edit-button-container'>
                <button onclick='handleProfileEdit("user-details")' class='edit-button'>Edit</button>
              </div>
            </div>
          `;

          getQuerySelector('.user-details-container').innerHTML = html;

          document.querySelectorAll('.edit-button-container').forEach(element => {
            Object.assign(element.style, {
              position: 'absolute',
              top: '5px',
              right: '5px',
            })
          });

          document.querySelectorAll('.edit-button').forEach(element => {
            Object.assign(element.style, {
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "5px",
              backgroundColor: "var(--color-green);",
              border: "transparent",
              boxSizing: "border-box",
              outline: "none",
              color: "#ffffff",
              boxShadow:
                "0 2px 10px 0 rgba(0, 0, 0, 0.14), 0 4px 5px -5px rgba(0, 0, 0, 0.5)",
              letterSpacing: "1px",
              fontSize: "16px",
              padding: "5px 20px"
            });
          });

          closeModal();
          toast('success', 'Account updated successfully!');
        })
        .catch((error) => {
          isSubmitting('modal-button-loading-spinner-wrapper', false);
          console.log(`error\n`, error);
          window.scroll({
            top: 0,
            behavior: 'smooth',
          });

          toast('error', 'There was an error');
        });
    }
  } else if (profileSection === 'about-me') {
    const aboutMeValue = getQuerySelector('.edit-about-me').value;
    let aboutMeIsValid = false;

    if (!aboutMeValue || aboutMeValue.length < 100) {
      document.querySelector('#about-me-error-text').innerHTML =
        'Please enter at least 100 characters';
      document.querySelector('#about-me-error-text').style.display = 'flex';
      aboutMeIsValid = false;
    } else if (inputHasSocialMediaAccount(aboutMeValue) || inputHasSocialMediaTag(aboutMeValue)) {
      document.querySelector('#about-me-error-text').innerHTML =
        'Email addresses and social media accounts are not allowed';
      document.querySelector('#about-me-error-text').style.display = 'flex';
      aboutMeIsValid = false;
    } else if (inputHasPhoneNumber(aboutMeValue)) {
      document.querySelector('#about-me-error-text').innerHTML =
        'Phone numbers are not allowed';
      document.querySelector('#about-me-error-text').style.display = 'flex';
      aboutMeIsValid = false;
    } else if (invalidString(aboutMeValue)) {
      document.querySelector('#about-me-error-text').innerHTML =
        'Special characters are not allowed';
      document.querySelector('#about-me-error-text').style.display = 'flex';
      aboutMeIsValid = false;
    } else {
      document.querySelector('#about-me-error-text').style.display = 'none';
      aboutMeIsValid = true;
    }

    if (aboutMeIsValid) {
      const aboutMe = getQuerySelector('.edit-about-me').value;

      isSubmitting('modal-button-loading-spinner-wrapper', true);
      Axios({
        method: 'put',
        apiUrl: '/api/user/profile-details/about-me', // server/routes/user/api.js
        params: { aboutMe },
      })
        .then(({ data }) => {
          isSubmitting('modal-button-loading-spinner-wrapper', false);
          const updatedAboutMe = data.aboutMe;
          const updatedAccountStatus = data.accountStatus;
          const updatedUserFacingMessage = data.userFacingMessage;

          getQuerySelector('#about-me-value').innerHTML = updatedAboutMe;

          if (updatedAccountStatus !== 'approved') {
            getQuerySelector('.account-status-message').innerHTML = updatedUserFacingMessage;

            const accountStatus = getQuerySelector('.account-status');

            /* Calculate the height of the warning message to add appropriate padding to the page. */
            const elementHeight = accountStatus.offsetHeight;
            const bodyWrapper = getQuerySelector('.body-wrapper');

            /*
              55 is to match the height of the navbar.
              20 is for extra spacing.
            */
            const marginTop = `${55 + elementHeight + 20}px`;

            Object.assign(bodyWrapper.style, {
              marginTop,
            })
          }

          closeModal();
          toast('success', 'Account updated successfully!');
        })
        .catch((error) => {
          isSubmitting('modal-button-loading-spinner-wrapper', false);
          console.log(`error\n`, error);
          window.scroll({
            top: 0,
            behavior: 'smooth',
          });

          closeModal();
          toast('error', 'There was an error');
        });
    }
  } else if (profileSection === 'about-my-match') {
    const aboutMyMatchValue = getQuerySelector('.edit-about-my-match').value;
    let aboutMyMatchIsValid = false;

    if (!aboutMyMatchValue || aboutMyMatchValue.length < 100) {
      document.querySelector('#about-my-match-error-text').innerHTML =
        'Please enter at least 100 characters';
      document.querySelector('#about-my-match-error-text').style.display = 'flex';
      aboutMyMatchIsValid = false;
    } else if (inputHasSocialMediaAccount(aboutMyMatchValue) || inputHasSocialMediaTag(aboutMyMatchValue)) {
      document.querySelector('#about-my-match-error-text').innerHTML =
        'Email addresses and social media accounts are not allowed';
      document.querySelector('#about-my-match-error-text').style.display = 'flex';
      aboutMyMatchIsValid = false;
    } else if (inputHasPhoneNumber(aboutMyMatchValue)) {
      document.querySelector('#about-my-match-error-text').innerHTML =
        'Phone numbers are not allowed';
      document.querySelector('#about-my-match-error-text').style.display = 'flex';
      aboutMyMatchIsValid = false;
    } else if (invalidString(aboutMyMatchValue)) {
      document.querySelector('#about-my-match-error-text').innerHTML =
        'Special characters are not allowed';
      document.querySelector('#about-my-match-error-text').style.display = 'flex';
      aboutMyMatchIsValid = false;
    } else {
      document.querySelector('#about-my-match-error-text').style.display = 'none';
      aboutMyMatchIsValid = true;
    }

    if (aboutMyMatchIsValid) {
      const aboutMyMatch = getQuerySelector('.edit-about-my-match').value;

      isSubmitting('modal-button-loading-spinner-wrapper', true);
      Axios({
        method: 'put',
        apiUrl: '/api/user/profile-details/about-my-match', // server/routes/user/api.js
        params: { aboutMyMatch },
      })
        .then(({ data }) => {
          isSubmitting('modal-button-loading-spinner-wrapper', false);
          const updatedAboutMyMatch = data.aboutMyMatch;
          const updatedAccountStatus = data.accountStatus;
          const updatedUserFacingMessage = data.userFacingMessage;

          getQuerySelector('#about-my-match-value').innerHTML = updatedAboutMyMatch;

          if (updatedAccountStatus !== 'approved') {
            getQuerySelector('.account-status-message').innerHTML = updatedUserFacingMessage;

            const accountStatus = getQuerySelector('.account-status');

            /* Calculate the height of the warning message to add appropriate padding to the page. */
            const elementHeight = accountStatus.offsetHeight;
            const bodyWrapper = getQuerySelector('.body-wrapper');

            /*
              55 is to match the height of the navbar.
              20 is for extra spacing.
            */
            const marginTop = `${55 + elementHeight + 20}px`;

            Object.assign(bodyWrapper.style, {
              marginTop,
            })
          }

          closeModal();
          toast('success', 'Account updated successfully!');
        })
        .catch((error) => {
          isSubmitting('modal-button-loading-spinner-wrapper', false);
          console.log(`error\n`, error);
          window.scroll({
            top: 0,
            behavior: 'smooth',
          });

          toast('error', 'There was an error');
        });
    }
  }
};
