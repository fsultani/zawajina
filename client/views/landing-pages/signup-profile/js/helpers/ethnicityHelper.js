(async () => {
  const ethnicityInput = document.querySelector('#ethnicityInput');
  const ethnicityResults = document.querySelector('#ethnicity-results');
  const ethnicityInputPlaceholder = 'Select up to 2';
  const userEthnicityResults = [];

  let currentFocus = 0;
  let results = [];

  ethnicityInput.placeholder = ethnicityInputPlaceholder;

  const getAllEthnicities = async userInput => {
    try {
      const data = await FetchData('/register/api/ethnicities', {
        params: {
          userInput,
        },
      });
      return data;
    } catch (error) {
      return error.response;
    }
  };

  const getUserEthnicityInput = () =>
    ethnicityInput.addEventListener(
      'input',
      debounce(async event => {
        const userInput = ethnicityInput.value;
        if (!userInput) {
          closeAllLists('#ethnicityInput');
          return false;
        }

        results = await getAllEthnicities(userInput);
        currentFocus = -1;

        let searchResultsWrapper = '<div class="autocomplete-items">';
        const userInputRegex = new RegExp(userInput, 'gi');

        results.map(ethnicity => {
          const ethnicityMatch = ethnicity.replace(userInputRegex, x => `<strong>${x}</strong>`);
          searchResultsWrapper += `
        <div
          id='${ethnicity}'
        >
          ${ethnicityMatch}
          <input
            type='hidden'
          />
        </div>
      `;
        });

        searchResultsWrapper += '</div>';
        document.querySelector('#ethnicity-results').innerHTML = searchResultsWrapper;
      }, 250)
    );

  const renderEthnicity = data => {
    const results = resultsData =>
      resultsData
        .map((response, index) => {
          const ethnicity = response.replace(/<\/?strong>/g, '');
          return `
              <div class='user-selection-wrapper display-user-ethnicity' id='wrapper-${index}'>
                <div class='user-selection-content user-ethnicity-content' id='${ethnicity}'>${ethnicity}</div>
                <div class='user-selection-remove-wrapper'>
                  <span role='img' aria-label='close' class='user-selection-remove user-ethnicity-remove' id='remove-ethnicity-${index}'>
                    <svg viewBox='64 64 896 896' focusable='false' data-icon='close' width='10px' height='10px' fill='currentColor' aria-hidden='true'>
                      <path d='M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z'></path>
                    </svg>
                  </span>
                </div>
              </div>
            `;
        })
        .join('');

    const selection = () => `
      <div class='user-selection-container'>
        ${results(data)}
      </div>
    `;
    const userSelection = document.querySelector('.user-ethnicity-selection');
    userSelection.innerHTML = selection();

    document.querySelectorAll('.display-user-ethnicity').forEach(element => {
      element.style.display = 'flex';
    });

    document.querySelector('#ethnicityInput').placeholder = '';

    if (data.length === 0) {
      document.querySelector('#ethnicityInput').disabled = false;
      document.querySelector('#ethnicityInput').placeholder = ethnicityInputPlaceholder;
      document.querySelector('.ethnicity').style.cssText = `padding-left: 20px`;
      ethnicityInput.focus();
    } else if (data.length < 2) {
      document.querySelector('#ethnicityInput').disabled = false;
      const selectionElement = userSelection.getBoundingClientRect();
      const locationElement = document
        .querySelector(`#remove-ethnicity-${data.length - 1}`)
        .getBoundingClientRect();

      document.querySelector('.ethnicity').style.cssText = `padding-left: ${
        locationElement.x - selectionElement.x + 30
      }px`;
      ethnicityInput.focus();

      removeEthnicitySelection();
    } else {
      document.querySelector('#ethnicityInput').disabled = true;
      removeEthnicitySelection();
    }

    closeAllLists('#ethnicityInput');
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

  const removeEthnicitySelection = () => {
    document.querySelectorAll('.user-ethnicity-remove').forEach(element => {
      element.addEventListener('click', el => {
        const elementId = el.currentTarget.id.split('-')[2];
        userEthnicityResults.splice(elementId, 1);
        renderEthnicity(userEthnicityResults);
      });
    });
  };

  ethnicityInput.addEventListener('keydown', event => {
    getUserEthnicityInput();

    getKeyDirection(event, element => {
      const value = element[currentFocus].id;
      const ethnicitySelection = value;
      ethnicityInput.value = '';
      if (userEthnicityResults.indexOf(ethnicitySelection) === -1) {
        userEthnicityResults.push(ethnicitySelection);
      }

      renderEthnicity(userEthnicityResults);
    });
  });

  ethnicityResults.addEventListener('click', event => {
    const value = event.target.id;
    const ethnicitySelection = value;
    ethnicityInput.value = '';

    if (userEthnicityResults.indexOf(ethnicitySelection) === -1) {
      userEthnicityResults.push(ethnicitySelection);
    }

    renderEthnicity(userEthnicityResults);
  });

  ethnicityInput.addEventListener('focusout', () => {
    setTimeout(() => {
      if (userEthnicityResults.length === 0) {
        closeAllLists('#ethnicityInput');
        document.querySelector('.user-ethnicity').style.cssText = 'padding-bottom: 4px';
        document.querySelector('#ethnicity-error').innerHTML =
          'Please select your ethnicity from the dropdown';
        document.querySelector('#ethnicity-error').style.display = 'block';
      } else {
        document.querySelector('.user-ethnicity').style.cssText = 'padding-bottom: 16px';
        document.querySelector('#ethnicity-error').style.display = 'none';
      }
    }, 250)
  })
})();
