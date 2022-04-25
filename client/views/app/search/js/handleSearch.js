const searchUrl = new URL(window.location.href);
searchUrl.pathname = '/search/results';

const minAgeRange = document.querySelector(".min-age-range");
const maxAgeRange = document.querySelector(".max-age-range");

let maritalStatus;
const handleMaritalStatus = event => (maritalStatus = event.target.value);

let religiousConviction;
const handleConviction = event => (religiousConviction = event.target.value);

let education;
const handleEducation = event => (education = event.target.value);

let minHeightValue;
const minHeightRange = document.querySelector(".min-height-range");

let maxHeightValue;
const maxHeightRange = document.querySelector(".max-height-range");

let hijab;
const handleHijab = value => (hijab = value);

let religiousValues;
const handleReligiousValues = event => (religiousValues = event.target.value);

let sortResults = 'lastActive';
const handleSortResults = event => (sortResults = event.target.value);

const handleSearch = async () => {
  const minAgeValue = minAgeRange.textContent
  const maxAgeValue = maxAgeRange.textContent;

  document.querySelectorAll('.user-location-content').forEach(({ id }) => {
    const location = JSON.parse(id);
    if (location.state) {
      searchUrl.searchParams.append('locations', JSON.stringify({ city: location.city, state: location.state, country: location.country }));
    } else {
      searchUrl.searchParams.append('locations', JSON.stringify({ city: location.city, country: location.country }));
    }
  });

  document.querySelectorAll('.user-ethnicity-content').forEach(({ id }) => {
    const { ethnicity } = JSON.parse(id);
    searchUrl.searchParams.append('ethnicity', ethnicity);
  });

  minHeightValue = minHeightRange.textContent;
  const minHeightValueSplit = minHeightValue.split('')
  const minHeightLeftParenthesis = minHeightValueSplit.indexOf('(')
  const minHeight = minHeightValueSplit.slice(minHeightLeftParenthesis + 1, -4).join('')

  maxHeightValue = maxHeightRange.textContent;
  const maxHeightValueSplit = maxHeightValue.split('')
  const maxHeightLeftParenthesis = maxHeightValueSplit.indexOf('(')
  const maxHeight = maxHeightValueSplit.slice(maxHeightLeftParenthesis + 1, -4).join('')

  const showPhotosOnly = document.querySelector(`#photos-only-checkbox`).checked;

  let searchOptions = {
    minAgeValue,
    maxAgeValue,
    maritalStatus,
    religiousConviction,
    education,
    minHeight,
    maxHeight,
    hijab,
    religiousValues,
    showPhotosOnly,
    sortResults,
  };

  Object.entries(searchOptions).map(entry => {
    const key = entry[0];
    const value = entry[1];

    if (value && !Array.isArray(value)) {
      searchUrl.searchParams.append(key, value);
    }
  });

  document.querySelectorAll('form *').forEach(item => item.disabled = true);

  window.location.href = searchUrl.href;
};
