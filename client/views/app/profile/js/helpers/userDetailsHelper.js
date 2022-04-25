const userDetailsHelper = () => {
  languageHelper();
  hobbiesHelper();
};

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
