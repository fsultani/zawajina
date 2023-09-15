let profileSection;

const handleProfileEdit = async (section) => {
  /* This modal is a custom modal for the profile photos. */
  if (section === 'photos') {
    const editPhotosModal = getQuerySelector('.edit-photos-modal')
    Object.assign(editPhotosModal.style, {
      display: 'block',
    });

    const modalContent = getQuerySelector('.edit-photos-modal-content')
    Object.assign(modalContent.style, {
      opacity: 1,
      zIndex: 2,
      animation: 'animation-show-modal 0.5s',
    });

    const sectionElement = getQuerySelector(`#${section}`);
    Object.assign(sectionElement.style, {
      display: 'block',
    });

    profileSection = 'photos';
    photosHelper();

    window.onclick = function (event) {
      if (event.target == editPhotosModal) {
        closePhotosModal();
      }
    }

    window.addEventListener('keyup', event => {
      if (event.key === 'Escape') {
        closePhotosModal();
      }
    })

    return;
  }

  if (section === 'location') {
    profileSection = 'location';
    const modalHeader = 'Location';

    const city = getQuerySelector('.user-location').dataset.city;
    const state = getQuerySelector('.user-location').dataset.state || null;
    const country = getQuerySelector('.user-location').dataset.country;
    const modalBody = `
      <section id='location' class='modal-section'>
        <div class='full-width'>
          <label for='locationInput'>What city do you live in?</label>
          <div class='autocomplete'>
            <div class='user-location-selection'></div>
            <input data-location='${city}|${state}|${country}' id='locationInput'
              class='custom-height' type='text' />
            <div id='location-results'></div>
          </div>
          <div id='city-error'></div>
        </div>
      </section>
    `;

    const modalBodyHTML = getQuerySelector('.modal-body');
    Object.assign(modalBodyHTML.style, {
      padding: '25px 0 14px',
    });

    const modalButton = 'Save';

    showModal({
      modalHeader,
      modalBody,
      modalButton,
      submitFormCallback: () => {
        handleSaveProfileChanges(profileSection);
      }
    });

    displaySmallLoadingSpinner(true, '.modal-content', '.close-modal');
    locationHelper();
    return;
  }

  if (section === 'user-details') {
    profileSection = 'user-details';
    const modalHeader = 'Details';

    const userDetails = document.querySelectorAll('.details-value')
    let religiousConviction;
    let religiousValues;
    let maritalStatus;
    let education;
    let profession;
    let languages = [];
    let canRelocate;
    let diet;
    let smokes;
    let hasChildren;
    let wantsChildren;
    let prayerLevel;
    let hijab = null;
    let hobbies = [];

    userDetails.forEach(item => {
      if (item.dataset.religiousConviction) religiousConviction = item.dataset.religiousConviction;
      if (item.dataset.religiousValues) religiousValues = item.dataset.religiousValues;
      if (item.dataset.maritalStatus) maritalStatus = item.dataset.maritalStatus;
      if (item.dataset.education) education = item.dataset.education;
      if (item.dataset.profession) profession = item.dataset.profession;
      if (item.dataset.languages) languages = item.dataset.languages;
      if (item.dataset.canRelocate) canRelocate = item.dataset.canRelocate;
      if (item.dataset.diet) diet = item.dataset.diet;
      if (item.dataset.smokes) smokes = item.dataset.smokes;
      if (item.dataset.hasChildren) hasChildren = item.dataset.hasChildren;
      if (item.dataset.wantsChildren) wantsChildren = item.dataset.wantsChildren;
      if (item.dataset.prayerLevel) prayerLevel = item.dataset.prayerLevel;
      if (item.dataset.hijab) hijab = item.dataset.hijab;
      if (item.dataset.hobbies) hobbies = item.dataset.hobbies;
    });

    const modalBody = `
      <section id='user-details' class='modal-section'>
        <div class='flex-space-between'>
          <div class='form-half-row'>
            <label>Conviction</label>
            <select data-religiousConviction='${religiousConviction}' class='religious-conviction-error'
              id='religious-convictions' onchange='handleReligiousConviction(event)'>
              <option value='Sunni'>Sunni</option>
              <option value='Shia'>Shia</option>
              <option value='Just Muslim'>Just Muslim</option>
              <option value='Other'>Other</option>
            </select>
          </div>
          <div class='form-half-row'>
            <label>Values</label>
            <select data-religiousValues='${religiousValues}' class='religious-values-error'
              id='religious-values' onchange='handleReligiousValues(event)'>
              <option value='Conservative'>Conservative</option>
              <option value='Moderate'>Moderate</option>
              <option value='Liberal'>Liberal</option>
            </select>
          </div>
        </div>

        <div class='flex-space-between'>
          <div class='form-half-row'>
            <label>Marital Status</label>
            <select data-maritalStatus='${maritalStatus}' class='marital-status-error' id='marital-status'
              onchange='handleMaritalStatus(event)'>
              <option value='Never Married'>Never Married</option>
              <option value='Divorced'>Divorced</option>
              <option value='Widowed'>Widowed</option>
            </select>
          </div>
          <div class='form-half-row'>
            <label>Education</label>
            <select data-education='${education}' class='education-error' id='education'
              onchange='handleEducation(event)'>
              <option value='High School'>High School</option>
              <option value='Associate degree'>Associate degree</option>
              <option value='Bachelor&#x27;s degree'>Bachelor&#x27;s degree</option>
              <option value='Master&#x27;s degree'>Master&#x27;s degree</option>
              <option value='Doctoral degree'>Doctoral degree</option>
            </select>
          </div>
        </div>

        <div class='flex-space-between'>
          <div class='form-half-row'>
            <label>Profession</label>
            <select data-profession='${profession}' class='profession-error' id='profession'
              onchange='handleProfession(event)'></select>
          </div>

          <div class='form-half-row'>
            <label>Can you relocate?</label>
            <select data-canRelocate='${canRelocate}' class='relocate-error' id='can-relocate'
              onchange='handleCanRelocate(event)'>
              <option value='canRelocateYes'>Yes</option>
              <option value='canRelocateNo'>No</option>
              <option value='canRelocateMaybe'>Maybe</option>
            </select>
          </div>
        </div>

        <div class='flex-space-between'>
          <div class='form-half-row'>
            <label>Diet</label>
            <select data-diet='${diet}' class='diet-error' id='diet' onchange='handleDiet(event)'>
              <option value='Halal only'>Halal only</option>
              <option value='Halal when possible'>Halal when possible</option>
              <option value='Eat anything'>Eat anything</option>
              <option value='Eat anything except pork'>Eat anything except pork</option>
              <option value='Vegetarian'>Vegetarian</option>
            </select>
          </div>

          <div class='form-half-row'>
            <label>Do you smoke?</label>
            <select data-smokes='${smokes}' class='form-flex smokes-error' id='smokes' onchange='handleSmokes(event)'>
              <option value='smokesYes'>Yes</option>
              <option value='smokesNo'>No</option>
            </select>
          </div>
        </div>

        <div class='flex-space-between'>
          <div class='form-half-row'>
            <label>Do you have children?</label>
            <select data-hasChildren='${hasChildren}' class='form-flex has-children-error' id='has-children'
              onchange='handleHasChildren(event)'>
              <option value='hasChildrenYes'>Yes</option>
              <option value='hasChildrenNo'>No</option>
            </select>
          </div>

          <div class='form-half-row'>
            <label>Do you want children?</label>
            <select data-wantsChildren='${wantsChildren}' class='form-flex wants-children-error'
              id='wants-children' onchange='handleWantsChildren(event)'>
              <option value='wantsChildrenYes'>Yes</option>
              <option value='wantsChildrenNo'>No</option>
              <option value='wantsChildrenMaybe'>Maybe</option>
            </select>
          </div>
        </div>

        <div class='flex-space-between'>
          <div class='form-half-row'>
            <label>Prayer Level</label>
            <select data-prayerLevel='${prayerLevel}' class='form-flex wants-children-error'
              id='prayer-level' onchange='handlePrayerLevel(event)'>
              <option value='Rarely'>Rarely</option>
              <option value='Sometimes'>Sometimes</option>
              <option value='Always'>Always</option>
            </select>
          </div>

          <div class='form-half-row'>
            <div class='${hijab === null ? `hide-hijab-container` : `show-hijab-container`}'>
              <label>Hijab</label>
              <select data-hijab='${hijab}' class='form-flex hijab-error'
                id='hijab' onchange='handleHijab(event)'>
                <option value='hijabYes'>Yes</option>
                <option value='hijabNo'>No</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <div class='user-languages'>
            <label for='languageInput'>What language(s) do you speak? (Up to 3)</label>
            <div class='autocomplete'>
              <div class='user-languages-selection'></div>
              <input data-languages='${languages}' id='languageInput' class='languages' type='text' />
              <div id='language-results'></div>
            </div>
            <div id='languages-error'></div>
          </div>
        </div>

        <div>
          <div class='user-hobbies'>
            <label for='hobbies-input'>Hobbies and Interests (Optional - up to 5)</label>
            <div class='autocomplete'>
              <div class='user-hobbies-selection'></div>
              <input data-hobbies='${hobbies}' id='hobbies-input' class='hobbies' type='text' />
              <div id='hobbies-results'></div>
            </div>
          </div>
        </div>
      </section>
    `;

    const modalButton = 'Save';

    displaySmallLoadingSpinner(true, '.modal-content', '.close-modal');
    showModal({
      modalHeader,
      modalBody,
      modalButton,
      customStyles: [
        {
          element: '#hobbies-input',
          style: {
            /* This padding value is used for cases where at least one language entry is present to avoid UI changes after the modal has rendered. */
            paddingTop: '59.9531px',
          }
        },
      ],
      submitFormCallback: () => {
        handleSaveProfileChanges(profileSection);
      },
    });

    userDetailsHelper();
    return;
  }

  if (section === 'about-me') {
    profileSection = 'about-me';
    const modalHeader = 'About Me';

    const modalBody = `
      <section id='about-me' class='modal-section'>
        <div class='full-width position-relative'>
          <div id='about-me-error-text'></div>
          <textarea class='edit-about-me about-me-error'
            name='about-me' placeholder='Describe yourself.'></textarea>
          <p class='character-count' id='about-me-character-count'>0/100</p>
        </div>
      </section>
    `;

    const modalButton = 'Save';
    showModal({
      modalHeader,
      modalBody,
      modalButton,
      submitFormCallback: () => {
        handleSaveProfileChanges(profileSection);
      }
    });

    aboutMeHelper({ reset: false });
    return;
  }

  if (section === 'about-my-match') {
    profileSection = 'about-my-match';
    const modalHeader = 'About Zawajina';

    const modalBody = `
      <section id='about-my-match' class='modal-section'>
        <div class='full-width position-relative'>
          <div id='about-my-match-error-text'></div>
          <textarea class='edit-about-my-match about-my-match-error'
            name='about-my-match' placeholder='Describe your ideal match.'></textarea>
          <p class='character-count' id='about-my-match-character-count'>0/100</p>
        </div>
      </section>
    `;

    const modalButton = 'Save';
    showModal({
      modalHeader,
      modalBody,
      modalButton,
      submitFormCallback: () => {
        handleSaveProfileChanges(profileSection);
      }
    });

    aboutMyMatchHelper({ reset: false });
    return;
  }
}

const closePhotosModal = () => {
  const modal = getQuerySelector('.edit-photos-modal')
  Object.assign(modal.style, {
    display: 'none',
  });

  document.querySelectorAll('.modal-section').forEach(element => {
    Object.assign(element.style, {
      display: 'none',
    })
  });

  // const form = getQuerySelector(`form[name=editPhotosForm]`);
  const form = document.forms.namedItem('editPhotosForm');
  form.reset();
}
