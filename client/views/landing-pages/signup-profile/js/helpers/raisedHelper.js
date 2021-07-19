(async () => {
  const raisedInput = document.querySelector('#raisedInput');
  const raisedResults = document.querySelector('#raised-results');
  const raisedInputPlaceholder = 'Enter country';

  let currentFocus = 0;
  let results = [];

  raisedInput.placeholder = raisedInputPlaceholder;

  const getAllCountries = async userInput => {
    try {
      const data = await FetchData('/register/api/countries', {
        params: {
          userInput,
        },
      });
      return data;
    } catch (error) {
      return error.response;
    }
  };

  const getUserCountryInput = () =>
    raisedInput.addEventListener(
      'input',
      debounce(async event => {
        const userInput = raisedInput.value;
        if (!userInput) {
          closeAllLists('#raisedInput');
          return false;
        }

        results = await getAllCountries(userInput);
        currentFocus = -1;

        let searchResultsWrapper = '<div class="autocomplete-items">';

        results.map(country => {
          searchResultsWrapper += `
        <div
          id='${country}'
        >
          ${country}
          <input
            type='hidden'
          />
        </div>
      `;
        });

        searchResultsWrapper += '</div>';
        document.querySelector('#raised-results').innerHTML = searchResultsWrapper;
      }, 250)
    );

  const renderCountry = country => {
    const countryName = country.replace(/<\/?strong>/g, '');
    const result = `
      <div class='user-selection-container'>
        <div class='user-selection-wrapper display-country'>
          <div class='user-selection-content user-country-content'>${countryName}</div>
          <div class='user-selection-remove-wrapper'>
            <span role='img' aria-label='close' class='user-selection-remove country-remove'>
              <svg viewBox='64 64 896 896' focusable='false' data-icon='close' width='10px' height='10px' fill='currentColor' aria-hidden='true'>
                <path d='M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z'></path>
              </svg>
            </span>
          </div>
        </div>
      </div>`;

    const userSelection = document.querySelector('.user-raised-selection');
    userSelection.innerHTML = result;
    document.querySelector('.display-country').style.display = 'flex';
    raisedInput.placeholder = '';
    raisedInput.disabled = true;
    closeAllLists('#raisedInput');

    removeCountrySelection();
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

  const removeCountrySelection = () => {
    document.querySelector('.country-remove').addEventListener('click', element => {
      document.querySelector('.user-country-content').textContent = '';
      document.querySelector('.display-country').style.display = 'none';
      raisedInput.placeholder = raisedInputPlaceholder;
      raisedInput.disabled = false;
      raisedInput.focus();
    });
  };

  raisedInput.addEventListener('keydown', event => {
    getUserCountryInput();

    getKeyDirection(event, element => {
      const value = element[currentFocus].id;
      const countrySelection = value;
      raisedInput.value = '';
      renderCountry(countrySelection);
    });
  });

  raisedResults.addEventListener('click', event => {
    const value = event.target.id;
    const countrySelection = value;
    raisedInput.value = '';
    renderCountry(countrySelection);
  });
})();
