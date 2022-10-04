let religiousConviction;
let religiousValues;
let maritalStatus;
let education;
let profession;
let relocate;
let diet;
let smokes;
let hasChildren;
let wantsChildren;
let hijab;
let hobbies;

const userDetailsHelper = () => {
  hobbiesHelper();
  languageHelper();
  professionHelper();

  const religiousConvictionsOptions = document.querySelector('#religious-convictions');
  religiousConviction = religiousConvictionsOptions.getAttribute('data-religiousConviction');
  religiousConvictionsOptions.value = religiousConviction;

  const religiousValuesOptions = document.querySelector('#religious-values');
  religiousValues = religiousValuesOptions.getAttribute('data-religiousValues');
  religiousValuesOptions.value = religiousValues;

  const maritalStatusOptions = document.querySelector('#marital-status');
  maritalStatus = maritalStatusOptions.getAttribute('data-maritalStatus');
  maritalStatusOptions.value = maritalStatus;

  const educationOptions = document.querySelector('#education');
  education = educationOptions.getAttribute('data-education');
  educationOptions.value = education;

  const relocateOptions = document.querySelector('#relocate');
  relocate = relocateOptions.getAttribute('data-relocate');

  const dietOptions = document.querySelector('#diet');
  diet = dietOptions.getAttribute('data-diet');

  const smokesOptions = document.querySelector('#smokes');
  smokes = smokesOptions.getAttribute('data-smokes');

  const hasChildrenOptions = document.querySelector('#has-children');
  hasChildren = hasChildrenOptions.getAttribute('data-hasChildren');

  const wantsChildrenOptions = document.querySelector('#wants-children');
  wantsChildren = wantsChildrenOptions.getAttribute('data-wantsChildren');

  const hijabOptions = document.querySelector('#hijab');
  hijab = hijabOptions.getAttribute('data-hijab');

  hobbies = [];

};

const handleConviction = event => religiousConviction = event.target.value;
const handleReligiousValues = event => religiousValues = event.target.value;
const handleMaritalStatus = event => maritalStatus = event.target.value;
const handleEducation = event => education = event.target.value;
const handleProfession = event => profession = event.target.value;
const handleRelocate = event => relocate = event.target.value;
const handleDiet = event => diet = event.target.value;
const handleSmokes = value => smokes = value;
const handleHasChildren = value => hasChildren = value;
const handleWantsChildren = value => wantsChildren = value;
const handleHijab = value => hijab = value;
