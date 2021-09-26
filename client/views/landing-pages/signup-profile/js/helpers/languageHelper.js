(async () => {
  const languageInput = document.querySelector('#languageInput');
  const languageResults = document.querySelector('#language-results');
  const languageInputPlaceholder = 'Select up to 3';
  const userLanguagesResult = [];

  let currentFocus = 0;
  let results = [];

  languageInput.placeholder = languageInputPlaceholder;

  const getAllLanguages = async userInput => {
    try {
      const data = await FetchData('/register/api/languages', {
        params: {
          userInput,
        },
      });
      return data;
    } catch (error) {
      return error.response;
    }
  };

  const getUserLanguageInput = () =>
    languageInput.addEventListener(
      'input',
      debounce(async event => {
        const userInput = languageInput.value;
        if (!userInput) {
          closeAllLists('#languageInput');
          return false;
        }

        results = await getAllLanguages(userInput);
        currentFocus = -1;

        let searchResultsWrapper = '<div class="autocomplete-items">';
        const userInputRegex = new RegExp(userInput, 'gi');

        results.map(language => {
          const languageMatch = language.replace(userInputRegex, x => `<strong>${x}</strong>`);
          searchResultsWrapper += `
        <div
          id='${language}'
        >
          ${languageMatch}
          <input
            type='hidden'
          />
        </div>
      `;
        });

        searchResultsWrapper += '</div>';
        document.querySelector('#language-results').innerHTML = searchResultsWrapper;
      }, 250)
    );

  const renderLanguages = data => {
    const results = resultsData =>
      resultsData
        .map((response, index) => {
          const language = response.replace(/<\/?strong>/g, '');
          return `
              <div class='user-selection-wrapper display-user-language' id='wrapper-${index}'>
                <div class='user-selection-content user-language-content' id='${language}'>${language}</div>
                <div class='user-selection-remove-wrapper'>
                  <span role='img' aria-label='close' class='user-selection-remove user-language-remove' id='remove-language-${index}'>
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
    const userSelection = document.querySelector('.user-languages-selection');
    userSelection.innerHTML = selection();

    document.querySelectorAll('.display-user-language').forEach(element => {
      element.style.display = 'flex';
    });

    document.querySelector('#languageInput').placeholder = '';

    if (data.length === 0) {
      document.querySelector('#languageInput').disabled = false;
      document.querySelector('#languageInput').placeholder = languageInputPlaceholder;
      document.querySelector('.languages').style.cssText = `padding-left: 20px`;
      languageInput.focus();
    } else if (data.length < 3) {
      document.querySelector('#languageInput').disabled = false;
      const selectionElement = userSelection.getBoundingClientRect();
      const locationElement = document
        .querySelector(`#remove-language-${data.length - 1}`)
        .getBoundingClientRect();

      document.querySelector('.languages').style.cssText = `padding-left: ${
        locationElement.x - selectionElement.x + 30
      }px`;
      languageInput.focus();

      removeLanguageSelection();
    } else {
      document.querySelector('#languageInput').disabled = true;
      removeLanguageSelection();
    }

    closeAllLists('#languageInput');
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

  const removeLanguageSelection = () => {
    document.querySelectorAll('.user-language-remove').forEach(element => {
      element.addEventListener('click', el => {
        const elementId = el.currentTarget.id.split('-')[2];
        userLanguagesResult.splice(elementId, 1);
        renderLanguages(userLanguagesResult);
      });
    });
  };

  languageInput.addEventListener('keydown', event => {
    getUserLanguageInput();

    getKeyDirection(event, element => {
      const value = element[currentFocus].id;
      const languageSelection = value;
      languageInput.value = '';

      if (userLanguagesResult.indexOf(languageSelection) === -1) {
        userLanguagesResult.push(languageSelection);
      }

      renderLanguages(userLanguagesResult);
    });
  });

  languageResults.addEventListener('click', event => {
    const value = event.target.id;
    const languageSelection = value;
    languageInput.value = '';

    if (userLanguagesResult.indexOf(languageSelection) === -1) {
      userLanguagesResult.push(languageSelection);
    }

    renderLanguages(userLanguagesResult);
  });

  languageInput.addEventListener('focusout', () => {
    setTimeout(() => {
      if (userLanguagesResult.length === 0) {
        closeAllLists('#languageInput');
        document.querySelector('.user-languages').style.cssText = 'padding-bottom: 4px';
        document.querySelector('#languages-error').innerHTML =
          'Please select your language from the dropdown';
        document.querySelector('#languages-error').style.display = 'block';
      } else {
        document.querySelector('.user-languages').style.cssText = 'padding-bottom: 16px';
        document.querySelector('#languages-error').style.display = 'none';
      }
    }, 250)
  })
})();
