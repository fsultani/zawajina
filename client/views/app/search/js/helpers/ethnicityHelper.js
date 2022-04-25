let ethnicityInput;
let ethnicityResults;
let ethnicityInputPlaceholder = 'Select up to 2';

let ethnicityHelperCurrentFocus = 0;
let ethnicityHelperResults = [];
const userEthnicityResults = [];

const removeEthnicitySelection = (index) => {
  userEthnicityResults.splice(index, 1);
  renderLocation(userEthnicityResults);
};

const renderEthnicity = data => {
  const renderResults = resultsData => (
    resultsData.map((response, index) => {
      const ethnicityValue = Object.values(response).join(', ');
      const ethnicity = ethnicityValue.replace(/<\/?strong>/g, '');
      return `
        <div class='user-selection-wrapper display-user-ethnicity' id='wrapper-${index}'>
          <div class='user-selection-content user-ethnicity-content' id='${JSON.stringify(response)}'>${ethnicity}</div>
          <div class='user-selection-remove-wrapper'>
            <span role='img' aria-label='close' class='user-selection-remove user-ethnicity-remove' id='remove-ethnicity-${index}' onclick="removeEthnicitySelection('${index}')">
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

  const userEthnicitySelectionContainer = document.querySelector('.user-ethnicity-selection-container');

  ethnicityInput.disabled = false;
  if (userEthnicitySelectionContainer.childElementCount === 0) {
    ethnicityInput.placeholder = ethnicityInputPlaceholder;
    document.querySelector('.ethnicity-textarea').style.cssText = `padding-left: 20px`;
    ethnicityInput.focus();
  } else if (userEthnicitySelectionContainer.childElementCount < 2) {
    const locationElement = document
      .querySelector(`#remove-ethnicity-${data.length - 1}`)
      .getBoundingClientRect();

    ethnicityInput.style.cssText = `
        height: auto;
        padding-top: ${locationElement.y - 245}px;
      `;
    ethnicityInput.focus();
  } else {
    ethnicityInput.disabled = true;
  }

  closeAllLists('#ethnicityInput');
};

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

const getUserEthnicityInput = () => {
  ethnicityInput.addEventListener(
    'input',
    debounce(async event => {
      const userInput = ethnicityInput.value;
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

(() => {
  ethnicityInput = document.querySelector('#ethnicityInput');
  ethnicityResults = document.querySelector('.ethnicity-results');
  ethnicityInput.placeholder = ethnicityInputPlaceholder;

  ethnicityInput.addEventListener('keydown', event => {
    getUserEthnicityInput();

    getKeyDirection(event, element => {
      const value = element[currentFocus].id;
      const ethnicity = value;
      ethnicityInput.value = '';
      if (userEthnicityResults.indexOf(ethnicity) === -1) {
        userEthnicityResults.push({ ethnicity });
      }

      renderEthnicity(userEthnicityResults);
    });
  });

  ethnicityResults.addEventListener('click', event => {
    const value = event.target.id;
    const ethnicity = value;
    ethnicityInput.value = '';

    if (userEthnicityResults.indexOf(ethnicity) === -1) {
      userEthnicityResults.push({ ethnicity });
    }

    renderEthnicity(userEthnicityResults);
  });
})();
