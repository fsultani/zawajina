const minAgeRange = getQuerySelector('.min-age-range');
const maxAgeRange = getQuerySelector('.max-age-range');

const minAgeSlider = getQuerySelector('.min-age-slider');
const maxAgeSlider = getQuerySelector('.max-age-slider');
const minGap = 0;

const ageRangeSliderTrack = getQuerySelector('.age-range-slider-track');
const sliderTotalDistanceValue = minAgeSlider.max - minAgeSlider.min;

const minAge = (minAgeValue = minAgeSlider.value, maxAgeValue = maxAgeSlider.value) => {
  if (parseInt(maxAgeValue) - parseInt(minAgeValue) <= minGap) {
    minAgeValue = parseInt(maxAgeValue) - minGap;
  }

  minAgeRange.textContent = minAgeValue;
  fillColor(minAgeValue, maxAgeValue);
}

const maxAge = (minAgeValue = minAgeSlider.value, maxAgeValue = maxAgeSlider.value) => {
  if (parseInt(maxAgeValue) - parseInt(minAgeValue) <= minGap) {
    maxAgeValue = parseInt(minAgeValue) + minGap;
  }

  maxAgeRange.textContent = maxAgeValue;

  if (maxAgeValue > 59) {
    maxAgeRange.textContent = `${maxAgeValue}+`;
    getQuerySelector('.max-age-wrapper').style.margin = '0 5px';
  } else {
    getQuerySelector('.max-age-wrapper').style.margin = 0;
  }

  fillColor(minAgeValue, maxAgeValue);
}

const fillColor = (minAgeValue, maxAgeValue) => {
  percent1 = (minAgeValue - minAgeSlider.min) / sliderTotalDistanceValue * 100;
  percent2 = (maxAgeValue - maxAgeSlider.min) / sliderTotalDistanceValue * 100;
  ageRangeSliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
}

minAge();
maxAge();

const minHeightRangeImperialValue = getQuerySelector('.min-height-range-imperial-value');
const minHeightRangeMetricValue = getQuerySelector('.min-height-range-metric-value');

const maxHeightRangeImperialValue = getQuerySelector('.max-height-range-imperial-value');
const maxHeightRangeMetricValue = getQuerySelector('.max-height-range-metric-value');

const minHeightGap = 0;
const heightsSliderTrack = getQuerySelector('.heights-slider-track');

const minHeightSlider = getQuerySelector('.min-height-slider');
const maxHeightSlider = getQuerySelector('.max-height-slider');

const heightsSliderTotalDistanceValue = minHeightSlider.max - minHeightSlider.min;

const heightsDictionary = [
  147,
  148,
  149,
  150,
  151,
  152,
  153,
  154,
  155,
  156,
  157,
  158,
  159,
  160,
  161,
  162,
  163,
  164,
  165,
  166,
  167,
  168,
  169,
  170,
  171,
  172,
  173,
  174,
  175,
  176,
  177,
  178,
  179,
  180,
  181,
  182,
  183,
  184,
  185,
  186,
  187,
  188,
  189,
  190,
  191,
  192,
  193,
  194,
  195,
  196,
];

const calculateImperialHeight = height => {
  const realFeet = ((height * 0.393700) / 12);
  let feet = Math.floor(realFeet);
  let inches = Math.round((realFeet - feet) * 12);

  if (inches === 12) {
    feet += 1;
    inches = 0;
  }

  return {
    feet,
    inches,
  }
};

const minHeight = (minHeightValue = minHeightSlider.value, maxHeightValue = maxHeightSlider.value) => {
  if (parseInt(maxHeightValue) - parseInt(minHeightValue) <= minHeightGap) {
    minHeightValue = parseInt(maxHeightValue) - minHeightGap;
  }

  const imperialHeight = calculateImperialHeight(minHeightValue);
  minHeightRangeImperialValue.innerHTML = `${imperialHeight.feet}'<span class='min-height-inches'>${imperialHeight.inches}</span>"`;
  getQuerySelector('.min-height-inches').style.cssText = `
    display: flex;
    width: ${imperialHeight.inches < 10 ? '10px' : '17px'};
    margin-left: 3px;
  `;

  minHeightRangeMetricValue.innerHTML = `&nbsp;(<span class='min-height-value'>${minHeightValue}</span>&nbsp;cm)`;
  getQuerySelector('.min-height-value').style.width = '25px';

  fillHeightsSliderColor(minHeightValue, maxHeightValue);
}

const maxHeight = (minHeightValue = minHeightSlider.value, maxHeightValue = maxHeightSlider.value) => {
  if (parseInt(maxHeightValue) - parseInt(minHeightValue) <= minHeightGap) {
    maxHeightValue = parseInt(minHeightValue) + minHeightGap;
  }

  const imperialHeight = calculateImperialHeight(maxHeightValue);
  maxHeightRangeImperialValue.innerHTML = `${imperialHeight.feet}'<span class='max-height-inches'>${imperialHeight.inches}</span>"`;
  getQuerySelector('.max-height-inches').style.cssText = `
    display: flex;
    width: ${imperialHeight.inches < 10 ? '10px' : '17px'};
    margin-left: 3px;
  `;

  maxHeightRangeMetricValue.innerHTML = `&nbsp;(<span class='max-height-value'>${maxHeightValue}</span>&nbsp;cm)`;
  getQuerySelector('.max-height-value').style.width = '25px';
  fillHeightsSliderColor(minHeightValue, maxHeightValue);
}

const fillHeightsSliderColor = (minHeightValue, maxHeightValue) => {
  percent1 = (minHeightValue - minHeightSlider.min) / heightsSliderTotalDistanceValue * 100;
  percent2 = (maxHeightValue - maxHeightSlider.min) / heightsSliderTotalDistanceValue * 100;
  heightsSliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
}

minHeight();
maxHeight();

window.onload = async () => {
  displayFullPageLoadingSpinner(true);

  if (typeof globalThis === 'object') {
    const { allCountries } = await getAllCountries();
    const { allEthnicities } = await getAllEthnicities();
    const { allLanguages } = await getAllLanguages();
    const {
      allCities,
      unitedStates,
    } = await locationData();

    const { searchOptions } = await Axios({
      method: 'get',
      apiUrl: '/search/api/user-data', // server/routes/search.js
    });

    userLocationsResult = searchOptions.locations;
    renderLocations(userLocationsResult);

    userLanguagesResult = searchOptions.languages;
    renderLanguages(userLanguagesResult);

    selectedProfessions = searchOptions.profession;
    renderProfessions(selectedProfessions);

    selectedHobbies = searchOptions.hobbies;
    renderHobbies(selectedHobbies);

    maritalStatusesArray = searchOptions.maritalStatus;
    renderCheckedMaritalStatus();

    religiousConvictionsArray = searchOptions.religiousConviction;
    renderCheckedReligiousConviction();

    religiousValuesArray = searchOptions.religiousValues;
    renderCheckedReligiousValues();

    educationArray = searchOptions.education;
    renderCheckedEducation();

    hasChildrenValue = searchOptions.hasChildren;
    renderSelectedHasChildren();

    wantsChildrenValue = searchOptions.wantsChildren;
    renderSelectedWantsChildren();

    hijabValue = searchOptions.hijab;
    renderSelectedHijab();

    canRelocateValue = searchOptions.canRelocate;
    renderSelectedCanRelocate();

    dietArray = searchOptions.diet;
    renderCheckedDiet();

    smokesValue = searchOptions.smokes;
    renderSelectedSmokes();

    if (searchOptions.age.$gte && searchOptions.age.$lte) {
      const minAgeValue = searchOptions.age.$gte;
      const maxAgeValue = searchOptions.age.$lte;

      minAge(minAgeValue, maxAgeValue);
      maxAge(minAgeValue, maxAgeValue);

      minAgeSlider.value = minAgeValue;
      maxAgeSlider.value = maxAgeValue;
    } else if (searchOptions.age.$exists) {
      minAge();
      maxAge();
    }

    if (searchOptions.height.$gte && searchOptions.height.$lte) {
      const minHeightValue = searchOptions.height.$gte;
      const maxHeightValue = searchOptions.height.$lte;

      minHeight(minHeightValue, maxHeightValue);
      maxHeight(minHeightValue, maxHeightValue);

      minHeightSlider.value = minHeightValue;
      maxHeightSlider.value = maxHeightValue;
    } else if (searchOptions.height.$exists) {
      minHeight();
      maxHeight();
    }

    prayerLevelsArray = searchOptions.prayerLevel;
    renderCheckedPrayerLevel();

    const sortResults = getQuerySelectorById('sort-results');
    sortResults.value = searchOptions.sortResults;

    const showPhotosOnly = getQuerySelectorById('photos-only-checkbox');
    showPhotosOnly.checked = searchOptions.photos;

    document.querySelectorAll('input[type=text]').forEach(element => element.blur());

    displayFullPageLoadingSpinner(false);

    return globalThis = {
      allCities,
      allCountries,
      allEthnicities,
      allLanguages,
      unitedStates,
    }
  };
}
