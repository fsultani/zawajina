(() => {
  document.querySelector('body').style.backgroundColor = '#f7f7f7';

  const profileIsUpdated = localStorage.getItem('my_match_profile_update');

  if (profileIsUpdated) {
    const toast = document.querySelector('.toast');
    const toastMessage = document.querySelector('.toast-message');
    toast.classList.add('show-toast')
    toast.classList.add('toast-success')
    toastMessage.innerHTML = 'Profile successfully updated!';
    setTimeout(() => {
      toast.classList.remove('show-toast')
      localStorage.removeItem('my_match_profile_update');
    }, 3000);
  }
})();

let locationData;
let languages = [];

const religiousConvictionsOptions = document.querySelector('.religious-convictions');
let religiousConviction = religiousConvictionsOptions.getAttribute('data-religiousConviction');

const religiousValuesOptions = document.querySelector('.religious-values');
let religiousValues = religiousValuesOptions.getAttribute('data-religiousValues');

const maritalStatusOptions = document.querySelector('.marital-status');
let maritalStatus = maritalStatusOptions.getAttribute('data-maritalStatus');

const educationOptions = document.querySelector('.education');
let education = educationOptions.getAttribute('data-education');

const professionsOptions = document.querySelector('.profession');
let profession = professionsOptions.getAttribute('data-profession');

const relocateOptions = document.querySelector('.relocate');
let relocate = relocateOptions.getAttribute('data-relocate');

const dietOptions = document.querySelector('.diet');
let diet = dietOptions.getAttribute('data-diet');

const smokesOptions = document.querySelector('.smokes');
let smokes = smokesOptions.getAttribute('data-smokes');

const hasChildrenOptions = document.querySelector('.has-children');
let hasChildren = hasChildrenOptions.getAttribute('data-hasChildren');

const wantsChildrenOptions = document.querySelector('.wants-children');
let wantsChildren = wantsChildrenOptions.getAttribute('data-wantsChildren');

const hijabOptions = document.querySelector('.hijab');
let hijab = hijabOptions.getAttribute('data-hijab');

let hobbies = [];

const formSubmitButton = document.querySelector('.form-submit');
const loadingSpinner = document.querySelector('.submit-loading-spinner');

const handleConviction = event => (religiousConviction = event.target.value);
const handleReligiousValues = event => (religiousValues = event.target.value);
const handleMaritalStatus = event => (maritalStatus = event.target.value);
const handleEducation = event => (education = event.target.value);
const handleProfession = event => (profession = event.target.value);
const handleRelocate = event => (relocate = event.target.value);
const handleDiet = event => (diet = event.target.value);
const handleSmokes = value => (smokes = value);
const handleHasChildren = value => (hasChildren = value);
const handleWantsChildren = value => (wantsChildren = value);
const handleHijab = value => (hijab = value);

window.onload = function () {
  const allInputFields = document.querySelectorAll('input[type=text]')
  allInputFields.forEach(field => field.blur());
};
