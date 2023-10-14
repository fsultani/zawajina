(async () => {
  const ethnicityInput = document.querySelector('#ethnicityInput');
  const ethnicityResults = document.querySelector('#ethnicity-results');
  const ethnicityInputPlaceholder = 'Search';
  const userEthnicityResults = [];

  let ethnicityHelperCurrentFocus = 0;
  let ethnicityHelperResults = [];

  ethnicityInput.placeholder = ethnicityInputPlaceholder;

  const getAllEthnicities = async userInput => {
    const { allEthnicities } = globalThis;

    const filteredResults = allEthnicities.filter(
      element => element.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    filteredResults.sort((a, b) => b < a);

    return filteredResults;
  }

  const getUserEthnicityInput = () => {
    ethnicityInput.addEventListener(
      'input',
      debounce(async event => {
        const userInput = event.target.value.toLowerCase().trim();
        if (!userInput) {
          closeAllLists('#ethnicityInput');
          return false;
        }

        ethnicityHelperResults = await getAllEthnicities(userInput);
        ethnicityHelperCurrentFocus = -1;

        let searchResultsWrapper = '<div class="autocomplete-items">';
        const userInputRegex = new RegExp(userInput, 'gi');

        ethnicityHelperResults.map(ethnicity => {
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
        ethnicityResults.innerHTML = searchResultsWrapper;
      }, 250)
    );
  };

  const renderEthnicity = data => {
    const renderResults = resultsData => (
      resultsData.map((response, index) => {
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
        .join('')
    )

    const selection = () => (`
      <div class='user-ethnicity-selection-container'>
        ${renderResults(data)}
      </div>
    `);

    const userSelection = document.querySelector('.user-ethnicity-selection');
    userSelection.innerHTML = selection();

    document.querySelectorAll('.display-user-ethnicity').forEach(element => {
      element.style.display = 'flex';
    });

    ethnicityInput.placeholder = '';

    ethnicityInput.disabled = false;
    if (data.length === 0) {
      ethnicityInput.placeholder = ethnicityInputPlaceholder;
      ethnicityInput.style.cssText = `padding-left: 20px`;
      ethnicityInput.focus();
    } else if (data.length < 3) {
      const selectionElement = userSelection.getBoundingClientRect();
      const locationElement = document
        .querySelector(`#remove-ethnicity-${data.length - 1}`)
        .getBoundingClientRect();

      ethnicityInput.style.cssText = `
        padding-top: ${locationElement.y - selectionElement.y + 50}px;
        padding-left: 8px;
      `;

      ethnicityInput.focus();

      removeEthnicitySelection();
    } else {
      ethnicityInput.disabled = true;
      removeEthnicitySelection();
    }

    closeAllLists('#ethnicityInput');
  };

  const getKeyDirection = (event, callback) => {
    let element = document.querySelector('.autocomplete-items');
    if (element) {
      element = element.getElementsByTagName('div');
    }
    if (event.key === 'ArrowDown' && ethnicityHelperCurrentFocus < ethnicityHelperResults.length - 1) {
      ethnicityHelperCurrentFocus++;
      addActive(element, ethnicityHelperCurrentFocus);
    } else if (event.key === 'ArrowUp' && ethnicityHelperCurrentFocus > 0) {
      ethnicityHelperCurrentFocus--;
      addActive(element, ethnicityHelperCurrentFocus);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (ethnicityHelperCurrentFocus > -1) {
        if (element) {
          callback(element);
        }
      }
    }
  };

  const removeEthnicitySelection = () => {
    document.querySelectorAll('.user-ethnicity-remove').forEach(element => {
      element.addEventListener('click', event => {
        const elementId = event.currentTarget.id.split('-')[2];
        userEthnicityResults.splice(elementId, 1);
        renderEthnicity(userEthnicityResults);
      });
    });
  };

  ethnicityInput.addEventListener('keydown', event => {
    getUserEthnicityInput();

    getKeyDirection(event, element => {
      const value = element[ethnicityHelperCurrentFocus].id;
      const ethnicity = value;
      ethnicityInput.value = '';

      const ethnicityExists = userEthnicityResults.findIndex(userEthnicity => userEthnicity.ethnicity === ethnicity) > -1;
      if (!ethnicityExists) {
        userEthnicityResults.push(ethnicity);
      }

      renderEthnicity(userEthnicityResults);
    });
  });

  ethnicityResults.addEventListener('click', event => {
    const value = event.target.closest('div').id;
    const ethnicity = value;
    ethnicityInput.value = '';

    const ethnicityExists = userEthnicityResults.findIndex(userEthnicity => userEthnicity.ethnicity === ethnicity) > -1;
    if (!ethnicityExists) {
      userEthnicityResults.push(ethnicity);
    }

    renderEthnicity(userEthnicityResults);
  });
})();
