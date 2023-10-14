let religiousConviction;
let religiousValues;
let maritalStatus;
let education;
let canRelocate;
let diet;
let smokes;
let hasChildren;
let wantsChildren;
let prayerLevel;
let hijab;

const userDetailsHelper = () => {
  Axios({
    apiUrl: '/api/user/profile-details/auth-user' // server/routes/user/api.js
  })
    .then(({ authUser }) => {
      professionHelper(authUser.profession);
      languageHelper(authUser.languages);
      hobbiesHelper(authUser.hobbies);

      const religiousConvictionsOptions = document.querySelector('#religious-convictions');
      religiousConvictionsOptions.value = authUser.religiousConviction;
      religiousConviction = authUser.religiousConviction;

      const religiousValuesOptions = document.querySelector('#religious-values');
      religiousValuesOptions.value = authUser.religiousValues;
      religiousValues = authUser.religiousValues;

      const maritalStatusOptions = document.querySelector('#marital-status');
      maritalStatusOptions.value = authUser.maritalStatus;
      maritalStatus = authUser.maritalStatus;

      const educationOptions = document.querySelector('#education');
      educationOptions.value = authUser.education;
      education = authUser.education;

      const relocateOptions = document.querySelector('#can-relocate');
      relocateOptions.value = authUser.canRelocate;
      canRelocate = authUser.canRelocate;

      const dietOptions = document.querySelector('#diet');
      dietOptions.value = authUser.diet;
      diet = authUser.diet;

      const smokesOptions = document.querySelector('#smokes');
      smokesOptions.value = authUser.smokes;
      smokes = authUser.smokes;

      const hasChildrenOptions = document.querySelector('#has-children');
      hasChildrenOptions.value = authUser.hasChildren;
      hasChildren = authUser.hasChildren;

      const wantsChildrenOptions = document.querySelector('#wants-children');
      wantsChildrenOptions.value = authUser.wantsChildren;
      wantsChildren = authUser.wantsChildren;

      const prayerLevelOptions = document.querySelector('#prayer-level');
      prayerLevelOptions.value = authUser.prayerLevel
      prayerLevel = authUser.prayerLevel;

      if (authUser.hijab) {
        const hijabOptions = document.querySelector('#hijab');
        hijabOptions.value = authUser.hijab;
        hijab = authUser.hijab;
      }

      displaySmallLoadingSpinner(false, '.modal-content', '.close-modal');
    })
};

const handleReligiousConviction = event => religiousConviction = event.target.value;
const handleReligiousValues = event => religiousValues = event.target.value;
const handleMaritalStatus = event => maritalStatus = event.target.value;
const handleEducation = event => education = event.target.value;
const handleCanRelocate = event => canRelocate = event.target.value;
const handleDiet = event => diet = event.target.value;
const handleSmokes = event => smokes = event.target.value;
const handleHasChildren = event => hasChildren = event.target.value;
const handleWantsChildren = event => wantsChildren = event.target.value;
const handlePrayerLevel = event => prayerLevel = event.target.value;
const handleHijab = event => hijab = event.target.value;
