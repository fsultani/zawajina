const profileId = window.location.pathname.split('/')[2];

const profilePageContainer = getQuerySelector('.profile-page-container');
const userId = profilePageContainer.getAttribute('data-user-id');

let profileSection;

const handleProfileEdit = async (section) => {
  const modal = getQuerySelector('.modal')
  Object.assign(modal.style, {
    display: 'block',
  });

  const modalContent = getQuerySelector('.modal-content')
  Object.assign(modalContent.style, {
    opacity: 1,
    zIndex: 2,
    animation: 'show .3s',
  });

  const sectionElement = getQuerySelector(`#${section}`);
  Object.assign(sectionElement.style, {
    display: 'block',
  });

  if (section === 'photos') {
		profileSection = 'photos'
    photosHelper();
  } else if (section === 'location') {
    locationHelper();
  } else if (section === 'user-details') {
    userDetailsHelper();
  } else if (section === 'about-me') {
    // editAboutMe = true;
    aboutMeHelper({ reset: false });
  } else if (section === 'about-match') {
    // editAboutMyMatch = true;
    aboutMyMatchHelper({ reset: false });
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      closeModal();
    }
  }

  window.addEventListener('keyup', event => {
    if (event.key === 'Escape') {
      closeModal();
    }
  })
}

const closeModal = () => {
  const modalContent = getQuerySelector('.modal-content')
  Object.assign(modalContent.style, {
    opacity: 0,
    zIndex: -1,
    animation: 'hide .2s',
  });

  // editAboutMe = false;
  aboutMeHelper({ reset: true });
  // editAboutMyMatch = false;
  aboutMyMatchHelper({ reset: true });

  setTimeout(() => {
    const modal = getQuerySelector('.modal')
    Object.assign(modal.style, {
      display: 'none',
    });

    document.querySelectorAll('.modal-section').forEach(element => {
      Object.assign(element.style, {
        display: 'none',
      })
    });
  }, 200)
}

if (profileId === userId) {
  disableOptions();

  axios.get(`/user/api/${userId}`).then(({ data }) => {
    const { authUser } = data;
    modalData = authUser;

    const profilePageHTML = `
      <div class="profile-page-wrapper">
        <div class="profile-photos-container position-relative">
          <div class="${authUser.photos.length > 0 ? 'photos-slider-wrapper' : 'no-photos-slider-wrapper'}" data-name='edit-button' data-section="photos">
            <div class="photos-container">
              <div class="slider-wrapper">
                ${authUser.photos.length > 0 ? authUser.photos.filter(photo => photo).map((photo, index) => `
                <div class="slide" id="${index}">
                  <img src="${photo.secure_url}" />
                </div>
                `).join('') : `<img src="${authUser.gender === 'male' ? '/static/assets/icons/male_profile.jpeg' : '/static/assets/icons/female_profile.jpeg'}" />`
              }
              </div>
              <div class="dots-wrapper">
                ${authUser.photos.length > 1 ? authUser.photos.filter(photo => photo).map(() => `<span class="dot"></span>`).join('') : ''}
              </div>
            </div>

            ${authUser.photos.length > 1 ? `
              <div class="image-previews-container">
                ${authUser.photos.filter(photo => photo).map((photo, index) => `
                <div class="image-preview-wrapper">
                  <img src="${photo.secure_url}" class="user-photo" onclick="goToImage('${index}')" />
                </div>
                `).join('')}
              </div>` : ''
            }

            <div class='edit-button-container'>
              <button onclick='handleProfileEdit("photos")' class='edit-button'>Edit</button>
            </div>
          </div>
        </div>

        <div class="user-main-info-container position-relative">
          <div class="flex-space-between" data-name='edit-button' data-section="location">
            <div class="user-main-info-wrapper">
              <h5 class="user-name-age" data-user-name-age="${authUser.name},${authUser.age}">${authUser.name}, ${authUser.age}</h5>
              <p class="user-location">
                Lives in
                <span id="user-city" data-city="${authUser.city}">${authUser.city}</span>,
                ${authUser.state !== null ? `<span id="user-state" data-state="${authUser.state}">${authUser.state}</span>, ` : ``}
                <span id="user-country" data-country="${authUser.country}">${authUser.country}</span>
              </p>
              <p>Last Active: ${authUser.lastActive}</p>
            </div>
            <div class="block-report-user-dropdown">
              <div class="ellipsis-menu" onclick="handleBlockReportUserMenu()">
                <div class="ellipsis-dot"></div>
                <div class="ellipsis-dot"></div>
                <div class="ellipsis-dot"></div>
              </div>
              <div class="block-report-user-dropdown-content">
                <div class="arrow"></div>
                <div class="inner-content">
                  <div onclick="handleBlockUser()">Block</div>
                  <div onclick="handleReportUser()">Report</div>
                </div>
              </div>
            </div>
          </div>
          <div class="contact-wrapper">
            <button class="message-button">
              <i class="far fa-envelope fa-2x"></i>
            </button>
            <button class="like-button">
              <i class="like-icon far fa-star fa-2x"></i>
            </button>

            <div class='edit-button-container'>
              <button onclick='handleProfileEdit("location")' class='edit-button'>Edit</button>
            </div>
          </div>
        </div>

        <div class="user-details-container position-relative">
          <div class="user-details-wrapper" data-name='edit-button' data-section="user-details">
            <h5 class="user-details-header">Details</h5>
            <div class="details-container">
              <div class="details-wrapper">
                <span class="details-key">Ethnicity:</span>
                <span class="details-value">${authUser.ethnicity.length > 0 ? authUser.ethnicity.map(ethnicity => ethnicity).join(' | ') : 'No Answer'}</span>
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
                <span class="details-value">${authUser.languages.length > 0 ? authUser.languages.map(language => language).join(' | ') : 'No Answer'}</span>
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
                <span class="details-value">${authUser.relocate || 'No Answer'}</span>
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
        </div>

        <div class="about-me position-relative">
          <div data-name='edit-button' data-section="about-me">
            <h5>About me</h5>
            <p>${authUser.aboutMe || 'No Answer'}</p>

            <div class='edit-button-container'>
              <button onclick='handleProfileEdit("about-me")' class='edit-button'>Edit</button>
            </div>
          </div>
        </div>

        <div class="about-match position-relative">
          <div data-name='edit-button' data-section="about-match">
            <h5>About my match</h5>
            <p>${authUser.aboutMyMatch || 'No Answer'}</p>

            <div class='edit-button-container'>
              <button onclick='handleProfileEdit("about-match")' class='edit-button'>Edit</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const modalHTML = `
      <div class="modal">
        <div class="modal-content">
          <button onclick='closeModal()' class="close-modal">&times;</button>
          <form name="profileForm" enctype="multipart/form-data" onsubmit="return false" novalidate autocomplete="off"
            class="settings-form">
            <section id="photos" class='modal-section'>
              <div class="flex-center">
                <div class="full-width form-header">
                  <h2>Photos</h2>
                </div>
              </div>

              <p class="photos-subtitle">
                Photos are optional, but highly recommended.
              </p>
              <div class="invalid-file-type">
                Please upload only JPEG or PNG
              </div>
              <div class="flex-space-between">
                <div data-photos="${authUser.photos}" data-photosLength="${authUser.photos.length}" class="images-wrapper">
                ${Array(6).fill().map((_, index) => `
                  <input type="file" name="image-${index}" class="image-${index}" hidden="hidden" accept=".jpg,.jpeg,.png" />
                    <div class="image-upload-container">
                    ${authUser.photos[index]?.secure_url ? `
                      <div class="image-upload-wrapper-${index}">
                        <div class="image-upload-${index}">
                          <img src="${authUser.photos[index]?.secure_url}" class="image-preview-${index}" />
                        </div>
                        <button class="remove-image-${index}"></button>
                        <div class="processing-bar-${index}"></div>
                        <div class="success-box-${index}"></div>
                      </div>
                    ` : `
                      <div class="image-upload-wrapper-${index}">
                        <div class="custom-button-${index}"></div>
                      </div>
                    `}
                  </div>
                `).join('')}
                </div>
                <!-- <div class="photos-buttons-container">
                  <div class="photos-button">
                    <button>Make Default</button>
                  </div>
                </div> -->
              </div>
            </section>

            <section id="location" class='modal-section'>
              <div class="flex-center">
                <div class="full-width form-header">
                  <h2>Location</h2>
                </div>
              </div>

              <div class="full-width user-location">
                <label for="locationInput">What city do you live in?</label>
                <div class="autocomplete">
                  <div class="user-location-selection"></div>
                  <input data-location="${authUser.city}|${authUser.state}|${authUser.country}" id="locationInput"
                    class="custom-height" type="text" />
                  <div id="location-results"></div>
                </div>
                <div id="city-error"></div>
              </div>
            </section>

            <section id="user-details" class='modal-section'>
              <div class="flex-center">
                <div class="full-width form-header">
                  <h2>Details</h2>
                </div>
              </div>

              <div class="flex-space-between">
                <div class="form-half-row">
                  <label>Conviction</label>
                  <select data-religiousConviction="${authUser.religiousConviction}" class="religious-conviction-error" id="religious-convictions" onchange="handleConviction(event)">
                    <option selected disabled>Select Conviction</option>
                    <option value="Sunni">Sunni</option>
                    <option value="Shia">Shia</option>
                    <option value="Just Muslim">Just Muslim</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div class="form-half-row">
                  <label>Values</label>
                  <select data-religiousValues="${authUser.religiousValues}" class="religious-values-error" id="religious-values" onchange="handleReligiousValues(event)">
                    <option selected disabled>Select Values</option>
                    <option value="Conservative">Conservative</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Liberal">Liberal</option>
                  </select>
                </div>
              </div>

              <div class="flex-space-between">
                <div class="form-half-row">
                  <label>Marital Status</label>
                  <select data-maritalStatus="${authUser.maritalStatus}" class="marital-status-error" id="marital-status" onchange="handleMaritalStatus(event)">
                    <option selected disabled>Marital Status</option>
                    <option value="Never Married">Never Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div class="form-half-row">
                  <label>Education</label>
                  <select data-education="${authUser.education}" class="education-error" id="education" onchange="handleEducation(event)">
                    <option selected disabled>Education Level</option>
                    <option value="High School">High School</option>
                    <option value="Associate degree">Associate degree</option>
                    <option value="Bachelor's degree">Bachelor's degree</option>
                    <option value="Master's degree">Master's degree</option>
                    <option value="Doctoral degree">Doctoral degree</option>
                  </select>
                </div>
              </div>

              <div class="flex-space-between">
                <div class="form-half-row">
                  <label>Profession</label>
                  <select data-profession="${authUser.profession}" class="profession-error" id="profession" onchange="handleProfession(event)"></select>
                </div>

                <div class="form-half-row">
                  <label>Can you relocate?</label>
                  <select data-relocate="${authUser.relocate}" class="relocate-error" id="relocate" onchange="handleRelocate(event)">
                    <option selected disabled>Select One</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Maybe">Maybe</option>
                  </select>
                </div>
              </div>

              <div class="flex-space-between">
                <div class="form-half-row">
                  <label>Diet</label>
                  <select data-diet="${authUser.diet}" class="diet-error" id="diet" onchange="handleDiet(event)">
                    <option selected disabled>Diet</option>
                    <option value="Halal only">Halal only</option>
                    <option value="Halal when possible">Halal when possible</option>
                    <option value="Eat anything">Eat anything</option>
                    <option value="Eat anything except pork">Eat anything except pork</option>
                    <option value="Vegetarian">Vegetarian</option>
                  </select>
                </div>

                <div class="form-half-row form-radio">
                  <label for="smokes">Do you smoke?</label>
                  <div data-smokes="${authUser.smokes}" class="form-flex smokes-error" id="smokes">
                    <input type="radio" name="smokes" id="smokes-yes" onchange="handleSmokes('Yes')" />
                    <label for="smokes-yes">Yes</label>
                    <input type="radio" name="smokes" id="smokes-no" onchange="handleSmokes('No')" />
                    <label for="smokes-no">No</label>
                  </div>
                </div>
              </div>

              <div class="flex-space-between">
                <div class="form-half-row form-radio">
                  <label for="has-children">Do you have children?</label>
                  <div data-hasChildren="${authUser.hasChildren}" class="form-flex has-children-error" id="has-children">
                    <input type="radio" name="has-children" id="has-children-yes" onchange="handleHasChildren('Yes')" />
                    <label for="has-children-yes">Yes</label>
                    <input type="radio" name="has-children" id="has-children-no" onchange="handleHasChildren('No')" />
                    <label for="has-children-no">No</label>
                  </div>
                </div>

                <div class="form-half-row form-radio">
                  <label for="wants-children">Do you want children?</label>
                  <div data-wantsChildren="${authUser.wantsChildren}" class="form-flex wants-children-error" id="wants-children">
                    <input type="radio" name="wants-children" id="wants-children-yes" onchange="handleWantsChildren('Yes')" />
                    <label for="wants-children-yes">Yes</label>
                    <input type="radio" name="wants-children" id="wants-children-no" onchange="handleWantsChildren('No')" />
                    <label for="wants-children-no">No</label>
                  </div>
                </div>
              </div>

              <div class="flex-space-between">
                <div class="form-half-row form-radio">
                  <div class="${authUser.hijab !== 'null' ? 'show-hijab-container' : 'hide-hijab-container'}">
                    <label for="hijab">Hijab</label>
                    <div data-gender="${authUser.gender}" data-hijab="${authUser.hijab}" class="form-flex hijab-error" id="hijab">
                      <input type="radio" name="hijab" id="hijab-yes" onchange="handleHijab('Yes')" />
                      <label for="hijab-yes">Yes</label>
                      <input type="radio" name="hijab" id="hijab-no" onchange="handleHijab('No')" />
                      <label for="hijab-no">No</label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div class="user-languages">
                  <label for="languageInput">What language(s) do you speak?</label>
                  <div class="autocomplete">
                    <div class="user-languages-selection"></div>
                    <input data-languages="${authUser.languages}" id="languageInput" class="languages" type="text" />
                    <div id="language-results"></div>
                  </div>
                  <div id="languages-error"></div>
                </div>
              </div>

              <div>
                <div class="user-hobbies">
                  <label for="hobbies-input">Hobbies and Interests (Optional)</label>
                  <div class="autocomplete">
                    <div class="user-hobbies-selection"></div>
                    <input data-hobbies="${authUser.hobbies}" id="hobbies-input" class="hobbies" type="text" />
                    <div id="hobbies-results"></div>
                  </div>
                </div>
              </div>
            </section>

            <section id="about-me" class='modal-section'>
              <div class="flex-center">
                <div class="full-width form-header">
                  <h2>About Me</h2>
                </div>
              </div>

              <div class="full-width">
                <div id="about-me-error-text"></div>
                <textarea data-aboutMe="${authUser.aboutMe}" class="edit-about-me about-me-error" id="edit-about-me"
                  name="about-me" placeholder="Describe yourself."></textarea>
                <p class="character-count" id="about-me-character-count">0/100</p>
              </div>
            </section>

            <section id="about-match" class='modal-section'>
              <div class="flex-center">
                <div class="full-width form-header">
                  <h2>About My Match</h2>
                </div>
              </div>

              <div class="full-width">
                <div id="about-my-match-error-text"></div>
                <textarea data-aboutMyMatch="${authUser.aboutMyMatch}" class="edit-about-my-match about-my-match-error"
                  id="edit-about-my-match" name="about-my-match" placeholder="Describe your ideal match."></textarea>
                <p class="character-count" id="about-my-match-character-count">0/100</p>
              </div>
            </section>

            <div class="flex-center">
              <div class="loading-spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>

              <div class="flex-center full-width signup-button-wrapper">
                <button type="submit" onclick="handleSaveProfileChanges(profileSection)" class="modal-button">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;

    profilePageContainer.innerHTML = profilePageHTML + modalHTML;
    const contactWrapperButtons = [getQuerySelector('.message-button'), getQuerySelector('.like-button')];
    const contactWrapperButtonsStyles = {
      backgroundColor: "#008cff",
      color: "#ffffff",
      boxShadow: '0 2px 10px 0 rgb(0 0 0 / 14%), 0 4px 5px -5px rgb(0 140 255 / 50%)',
    };

    contactWrapperButtons.forEach(element => {
      element.addEventListener("mouseover", () => {
        Object.assign(element.style, {
          ...contactWrapperButtonsStyles,
          cursor: "auto",
        });
      });

      element.addEventListener("mouseleave", () => {
        Object.assign(element.style, { ...contactWrapperButtonsStyles })
      });
    });

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
        backgroundColor: "#008cff",
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

    const likeButton = document.querySelector('.like-button');
    Object.assign(likeButton.style, {
      backgroundColor: '#008cff',
      color: '#ffffff',
      border: 'transparent',
    });

    const userPhotosLength = authUser.photos.length;
    const profilePhotosContainer = getQuerySelector('.profile-photos-container');

    if (userPhotosLength > 1) {
      profilePhotosContainer.style.height = '390px';
      slideWidth = getQuerySelector('.slide').clientWidth;

      getQuerySelector('.dot').classList.add('active');
      profilePhotosContainer.style.marginBottom = userPhotosLength < 1 ? 0 : '80px';

      const carousel = getQuerySelector('.slider-wrapper');
      const elements = document.querySelectorAll('.slider-wrapper > *');
      const elementIndices = {};
      let currentIndex = 0;

      const allDots = getQuerySelector('.dots-wrapper').getElementsByTagName('span');
      const observer = new IntersectionObserver(
        function (entries, _observer) {
          const activated = entries.reduce(function (max, entry) {
            return entry.intersectionRatio > max.intersectionRatio ? entry : max;
          });
          if (activated.intersectionRatio > 0) {
            currentIndex = elementIndices[activated.target.getAttribute('id')];
            for (let i = 0; i < allDots.length; i++) {
              if (allDots[i].classList.contains('active')) {
                allDots[i].classList.remove('active');
              }
            }
            allDots[currentIndex].classList.add('active');
          }
        },
        {
          root: carousel,
          threshold: 0.5,
        }
      );

      for (let i = 0; i < elements.length; i++) {
        elementIndices[elements[i].getAttribute('id')] = i;
        observer.observe(elements[i]);
      }
    } else {
      profilePhotosContainer.style.height = '390px';
    }
  })
}
