const locationInput = document.querySelector('#locationInput');
const locationResults = document.querySelector('#location-results');
const locationInputPlaceholder = 'Search';

let userLocationsResult = [];
let locationHelperCurrentFocus = 0;
let renderResults = [];

locationInput.placeholder = locationInputPlaceholder;

const getLocations = async userInput => {
  const { allCountries, allCities, unitedStates } = globalThis;

  const state = unitedStates
    .filter(location => location.name.toLowerCase().indexOf(userInput) > -1)
    .map(location => ({
      city: null,
      state: location.name,
      country: 'United States',
    }));

  const cities = allCities
    .filter(location => location.city.toLowerCase().indexOf(userInput) > -1 && location.state === null)
    .map(location => ({
      city: location.city,
      state: null,
      country: location.country,
    }));

  const countries = allCountries
    .filter(location => location.country.toLowerCase().indexOf(userInput) > -1)
    .map(location => ({
      city: null,
      state: null,
      country: location.country,
    }));

  const filteredResults = [...countries, ...state, ...cities].slice(0, 7);

  return filteredResults;
};

const getUserLocationInput = () => locationInput.addEventListener(
  'input',
  debounce(async event => {
    const userInput = event.target.value.toLowerCase().trim();
    if (!userInput) {
      closeAllLists('#locationInput');
      return false;
    }

    renderResults = await getLocations(userInput);
    locationHelperCurrentFocus = -1;

    let searchResultsWrapper = '<div class="autocomplete-items">';
    const userInputRegex = new RegExp(userInput, 'gi');

    renderResults.map(({ city, state, country }) => {
      let fullLocation = '';
      if (city) {
        fullLocation = `${city}, ${country}`;
      }

      if (state) {
        fullLocation = `${state}, ${country}`;
      }

      if (!city && !state) {
        fullLocation = country;
      }

      const match = fullLocation.replace(userInputRegex, match => `<strong>${match}</strong>`);
      searchResultsWrapper += `
        <div
          data-city=${city ? JSON.stringify(city) : null}
          data-state=${state ? JSON.stringify(state) : null}
          data-country=${country ? JSON.stringify(country) : null}
        >
          ${match}
          <input
            type='hidden'
            data-city=${city ? JSON.stringify(city) : null}
            data-state=${state ? JSON.stringify(state) : null}
            data-country=${country ? JSON.stringify(country) : null}
          />
        </div>
      `;
    });

    searchResultsWrapper += '</div>';
    locationResults.innerHTML = searchResultsWrapper;
  }, 250)
);

const renderLocations = data => {
  const renderResults = resultsData => (
    resultsData.map((response, index) => {
      const fullLocation = Object.values(response).filter(item => item !== 'null' ? item : '').join(', ');
      const location = fullLocation.replace(/<\/?strong>/g, '');

      return `
        <div class='user-selection-wrapper display-user-location' id='wrapper-${index}'>
          <div class='user-selection-content user-location-content' id='${JSON.stringify(response)}'>${location}</div>
          <div class='user-selection-remove-wrapper'>
            <span role='img' aria-label='close' class='user-selection-remove user-location-remove' id='remove-location-${index}'>
              <svg viewBox='64 64 896 896' focusable='false' data-icon='close' width='10px' height='10px' fill='currentColor' aria-hidden='true'>
                <path d='M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z'></path>
              </svg>
            </span>
          </div>
        </div>
      `;
    }).join('')
  );

  const selection = () => `
    <div class='user-selection-container'>
      ${renderResults(data)}
    </div>
  `;

  const userSelection = document.querySelector('.user-location-selection');
  userSelection.innerHTML = selection();

  document.querySelectorAll('.display-user-location').forEach(element => {
    element.style.display = 'flex';
  });

  locationInput.placeholder = '';

  locationInput.disabled = false;
  if (data.length === 0) {
    locationInput.placeholder = locationInputPlaceholder;
    locationInput.style.cssText = `padding-left: 20px`;
    locationInput.focus();
  } else {
    const selectionElement = userSelection.getBoundingClientRect();
    const locationElement = document
      .querySelector(`#remove-location-${data.length - 1}`)
      .getBoundingClientRect();

    locationInput.style.cssText = `
      padding-top: ${locationElement.y - selectionElement.y + 50}px;
      padding-left: 8px;
    `;

    locationInput.focus();

    removeLocationSelection();

    if (data.length === 5) locationInput.disabled = true;
  }

  closeAllLists('#locationInput');
};

const locationKeyDirection = (event, callback) => {
  let element = document.querySelector('.autocomplete-items');
  if (element) {
    element = element.getElementsByTagName('div');
  }
  if (event.key === 'ArrowDown' && locationHelperCurrentFocus < renderResults.length - 1) {
    locationHelperCurrentFocus++;
    addActive(element, locationHelperCurrentFocus);
  } else if (event.key === 'ArrowUp' && locationHelperCurrentFocus > 0) {
    locationHelperCurrentFocus--;
    addActive(element, locationHelperCurrentFocus);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    if (locationHelperCurrentFocus > -1) {
      if (element) {
        callback(element);
      }
    }
  }
};

const removeLocationSelection = () => {
  document.querySelectorAll('.user-location-remove').forEach(element => {
    element.addEventListener('click', el => {
      const elementId = el.currentTarget.id.split('-')[2];
      userLocationsResult.splice(elementId, 1);
      renderLocations(userLocationsResult);
    });
  });
};

locationInput.addEventListener('keydown', event => {
  getUserLocationInput();

  locationKeyDirection(event, element => {
    const value = element[locationHelperCurrentFocus].getElementsByTagName('input')[0];
    const city = value.dataset.city;
    const state = value.dataset.state;
    const country = value.dataset.country;
    locationInput.value = '';

    const locationExista = userLocationsResult.findIndex(location => location.city === city && location.state === state && location.country === country) > -1;
    if (!locationExista) {
      userLocationsResult.push({ city, state, country });
    }

    renderLocations(userLocationsResult);
  });
});

locationResults.addEventListener('click', event => {
  const inputTag = event.target.dataset;
  if (inputTag?.city) {
    const city = inputTag.city;
    const state = inputTag.state;
    const country = inputTag.country;
    locationInput.value = '';

    const locationExista = userLocationsResult.findIndex(location => location.city === city && location.state === state && location.country === country) > -1;
    if (!locationExista) {
      userLocationsResult.push({ city, state, country });
    }

    renderLocations(userLocationsResult);
  }
});
