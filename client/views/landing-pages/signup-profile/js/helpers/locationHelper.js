(async () => {
  const locationInput = document.querySelector('#locationInput');
  const locationResults = document.querySelector('#location-results');
  const locationInputPlaceholder = 'Enter your city';

  let currentFocus = 0;
  let results = [];

  locationInput.placeholder = locationInputPlaceholder;

  const getUserIPAddress = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const userIPAddress = await getUserIPAddress();

  const getAllCountries = async userInput => {
    try {
      const data = await FetchData('/register/api/cities', {
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

  const getUserLocationInput = () =>
    locationInput.addEventListener(
      'input',
      debounce(async event => {
        const userInput = locationInput.value;
        if (!userInput) {
          closeAllLists('#locationInput');
          locationInput.setAttribute('data-city', '');
          locationInput.setAttribute('data-state', '');
          locationInput.setAttribute('data-country', '');
          return false;
        }

        results = await getAllCountries(userInput);
        currentFocus = -1;

        let searchResultsWrapper = '<div class="autocomplete-items">';

        results.map(({ match, city, state, country }) => {
          searchResultsWrapper += `
        <div
          data-city=${JSON.stringify(city)}
          data-state=${JSON.stringify(state)}
          data-country=${JSON.stringify(country)}
        >
          ${match}
          <input
            type='hidden'
            data-city=${JSON.stringify(city)}
            data-state=${JSON.stringify(state)}
            data-country=${JSON.stringify(country)}
          />
        </div>
      `;
        });

        searchResultsWrapper += '</div>';
        document.querySelector('#location-results').innerHTML = searchResultsWrapper;
      }, 250)
    );

  const renderLocation = (data, city, state, country) => {
    const result = `
      <div class='user-selection-container'>
        <div class='user-selection-wrapper display-user-location'>
          <div class='user-selection-content user-location-content'>${data}</div>
          <div class='user-selection-remove-wrapper'>
            <span role='img' aria-label='close' class='user-selection-remove user-location-remove'>
              <svg viewBox='64 64 896 896' focusable='false' data-icon='close' width='10px' height='10px' fill='currentColor' aria-hidden='true'>
                <path d='M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z'></path>
              </svg>
            </span>
          </div>
        </div>
      </div>`;

    const userSelection = document.querySelector('.user-location-selection');
    userSelection.innerHTML = result;
    document.querySelector('.display-user-location').style.display = 'flex';
    locationInput.placeholder = '';
    locationInput.disabled = true;
    closeAllLists('#locationInput');

    locationInput.setAttribute('data-city', city);
    locationInput.setAttribute('data-state', state);
    locationInput.setAttribute('data-country', country);

    removeLocationSelection();
  };

  const getKeyDirection = (event, callback) => {
    let element = document.querySelector('.autocomplete-items');
    if (element) {
      element = element.getElementsByTagName('div');
    }
    if (event.key === 'ArrowDown' && currentFocus < results.length - 1) {
      currentFocus++;
      addActive(element, currentFocus);
    } else if (event.key === 'ArrowUp' && currentFocus > 0) {
      currentFocus--;
      addActive(element, currentFocus);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (currentFocus > -1) {
        if (element) {
          callback(element);
        }
      }
    }
  };

  const removeLocationSelection = () => {
    document.querySelector('.user-location-remove').addEventListener('click', () => {
      locationInput.removeAttribute('data-city');
      locationInput.removeAttribute('data-state');
      locationInput.removeAttribute('data-country');

      document.querySelector('.display-user-location').style.display = 'none';
      locationInput.placeholder = locationInputPlaceholder;
      locationInput.disabled = false;
      locationInput.focus();
    });
  };

  locationInput.addEventListener('keydown', event => {
    getUserLocationInput();
    getKeyDirection(event, element => {
      const value = element[currentFocus].getElementsByTagName('input')[0];
      const city = value.dataset.city;
      const state = value.dataset.state;
      const country = value.dataset.country;
      const locationSelection = `${city}, ${state !== 'null' ? `${state}, ${country}` : country}`;
      locationInput.value = '';

      renderLocation(locationSelection, city, state, country);
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

      renderLocation(locationSelection, city, state, country);
    }
  });
})();
