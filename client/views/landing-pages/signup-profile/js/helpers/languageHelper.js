(async () => {
  const languageInput = document.querySelector('#languageInput');
  const languageResults = document.querySelector('#language-results');
  const languageInputPlaceholder = 'What language(s) do you speak? (Select up to 3)';
  const userLanguagesResult = [];
  let currentFocus;

  languageInput.placeholder = languageInputPlaceholder;

  const getAllLanguages = async userInput => {
    try {
      let response;
      setTimeout(() => {
        if (!response) {
          document.querySelector('body').style.cssText = `
            background-color: rgba(0,0,0,0.5);
            opacity: 0.5;
          `;

          document.querySelector('.full-page-loading-spinner').style.cssText = `
            display: inline-block;
          `;
        }
      }, 1000);
      response = await axios.get(`/register/api/languages-list`, {
        params: {
          userInput,
        },
      });

      document.querySelector('body').style.cssText = `
        background-color: #ffffff;
        opacity: 1;
      `;

      document.querySelector('.full-page-loading-spinner').style.cssText = `
        display: none;
      `;

      return response.data;
    } catch (err) {
      console.error(err);
      document.querySelector('body').style.cssText = `
        background-color: #ffffff;
        opacity: 1;
      `;

      document.querySelector('.full-page-loading-spinner').style.cssText = `
        display: none;
      `;

      return err.response;
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

        const results = await getAllLanguages(userInput);
        currentFocus = -1;

        let searchResultsWrapper = '<div class="autocomplete-items">';

        results.map(language => {
          searchResultsWrapper += `
        <div
          id='${language}'
        >
          ${language}
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
        .map(
          (response, index) =>
            `<div class='user-selection-wrapper display-user-language' id='wrapper-${index}'>
        <div class='user-selection-content user-language-content' id='${response}'>${response}</div>
        <div class='user-selection-remove-wrapper'>
          <span role='img' aria-label='close' class='user-selection-remove user-language-remove' id='remove-language-${index}'>
            <svg viewBox='64 64 896 896' focusable='false' data-icon='close' width='10px' height='10px' fill='currentColor' aria-hidden='true'>
              <path d='M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z'></path>
            </svg>
          </span>
        </div>
      </div>`
        )
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
    if (event.key === 'ArrowDown') {
      currentFocus++;
      addActive(element, currentFocus);
    } else if (event.key === 'ArrowUp') {
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

      userLanguagesResult.push(languageSelection);

      renderLanguages(userLanguagesResult);
    });
  });

  languageResults.addEventListener('click', event => {
    const value = event.target.id;
    const languageSelection = value;
    languageInput.value = '';

    userLanguagesResult.push(languageSelection);

    renderLanguages(userLanguagesResult);
  });
})();
