let locationInput;
let locationResults;
let locationInputPlaceholder = 'Enter up to 5 locations';

let locationHelperCurrentFocus = 0;
let locationHelperResults = [];
const userLocationsResult = [];

const removeLocationSelection = (index) => {
  userLocationsResult.splice(index, 1);
  renderLocation(userLocationsResult);
};

const renderLocation = data => {
  const renderResults = resultsData => (
    resultsData.map((response, index) => {
      const fullLocation = Object.values(response).filter(item => item !== 'null' ? item : '').join(', ');
      const location = fullLocation.replace(/<\/?strong>/g, '');
      return `
        <div class='user-selection-wrapper display-user-location' id='wrapper-${index}'>
          <div class='user-selection-content user-location-content' id='${JSON.stringify(response)}'>${location}</div>
          <div class='user-selection-remove-wrapper'>
            <span role='img' aria-label='close' class='user-selection-remove user-location-remove' id='remove-location-${index}' onclick="removeLocationSelection('${index}')">
              <svg viewBox='64 64 896 896' focusable='false' data-icon='close' width='10px' height='10px' fill='currentColor' aria-hidden='true'>
                <path d='M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z'></path>
              </svg>
            </span>
          </div>
        </div>
      `;
    }).join('')
  );

  const selection = () => (`
    <div class='user-location-selection-container'>
      ${renderResults(data)}
    </div>
  `);

  const userSelection = document.querySelector('.user-location-selection');
  userSelection.innerHTML = selection();

  document.querySelectorAll('.display-user-location').forEach(element => {
    element.style.display = 'flex';
  });

  locationInput.placeholder = '';

  const userLocationSelectionContainer = document.querySelector('.user-location-selection-container')

  locationInput.disabled = false;
  if (userLocationSelectionContainer.childElementCount === 0) {
    locationInput.placeholder = locationInputPlaceholder;
    document.querySelector('.location-textarea').style.cssText = `padding-left: 20px`;
    locationInput.focus();
  } else if (userLocationSelectionContainer.childElementCount < 5) {
    const locationElement = document
      .querySelector(`#remove-location-${data.length - 1}`)
      .getBoundingClientRect();

    locationInput.style.cssText = `
        height: auto;
        padding-top: ${locationElement.y - 245}px;
      `;
    locationInput.focus();
  } else {
    locationInput.disabled = true;
  }

  closeAllLists('#locationInput');
};

const getKeyDirection = (event, callback) => {
  let element = document.querySelector('.autocomplete-items');
  if (element) {
    element = element.getElementsByTagName('div');
  }
  if (event.key === 'ArrowDown' && locationHelperCurrentFocus < locationHelperResults.length - 1) {
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

const getAllCountries = async userInput => {
  try {
    const userIPAddress = await getUserIPAddress();
    const data = await FetchData('/search/api', {
      params: {
        userIPAddress,
        userInput,
      },
    });
    return data;
  } catch (error) {
    return error.response;
  }
};

const getUserLocationInput = () => {
  locationInput.addEventListener(
    'input',
    debounce(async event => {
      const userInput = event.target.value;
      if (!userInput) {
        closeAllLists('#locationInput');
        return false;
      }

      locationHelperResults = await getAllCountries(userInput);
      locationHelperCurrentFocus = -1;

      let searchResultsWrapper = '<div class="autocomplete-items">';

      locationHelperResults.map(({ match, city, state, country }) => {
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
  )
};

(() => {
  locationInput = document.querySelector('#locationInput');
  locationResults = document.querySelector('.location-results');
  locationInput.placeholder = locationInputPlaceholder;

  locationInput.addEventListener('keydown', event => {
    getUserLocationInput();

    getKeyDirection(event, element => {
      const value = element[locationHelperCurrentFocus].getElementsByTagName('input')[0];
      const city = value.dataset.city;
      const state = value.dataset.state;
      const country = value.dataset.country;
      const locationSelection = `${city}, ${state !== 'null' ? `${state}, ${country}` : country}`;
      locationInput.value = '';

      if (userLocationsResult.indexOf(locationSelection) === -1) {
        userLocationsResult.push({ city, state, country });
      }

      renderLocation(userLocationsResult);
    });
  });

  locationResults.addEventListener('click', event => {
    const inputTag = event.target.dataset;
    if (inputTag?.city) {
      const city = inputTag.city;
      const state = inputTag.state;
      const country = inputTag.country;
      const locationSelection = `${city}, ${state !== 'null' ? `${state}, ${country}` : country}`;
      locationInput.value = '';

      if (userLocationsResult.indexOf(locationSelection) === -1) {
        userLocationsResult.push({ city, state, country });
      }

      renderLocation(userLocationsResult);
    }
  });
})();
