(async () => {
  const hobbiesInput = document.querySelector('#hobbies-input');
  const hobbiesResults = document.querySelector('#hobbies-results');
  const hobbiesInputPlaceholder = 'Select up to 5';
  const userHobbiesResults = [];

  let currentFocus = 0;
  let results = [];

  hobbiesInput.placeholder = hobbiesInputPlaceholder;

  const getAllHobbies = async userInput => {
    try {
      const data = await FetchData('/register/api/hobbies', {
        params: {
          userInput,
        },
      });
      return data;
    } catch (error) {
      return error.response;
    }
  };

  const getUserHobbyINput = () =>
    hobbiesInput.addEventListener(
      'input',
      debounce(async event => {
        const userInput = hobbiesInput.value;
        if (!userInput) {
          closeAllLists('#hobbies-input');
          return false;
        }

        results = await getAllHobbies(userInput);
        currentFocus = -1;

        let searchResultsWrapper = '<div class="autocomplete-items">';
        const userInputRegex = new RegExp(userInput, 'gi');

        results.map(hobby => {
          const hobbyMatch = hobby.replace(userInputRegex, x => `<strong>${x}</strong>`);
          searchResultsWrapper += `
        <div
          id='${hobby}'
        >
          ${hobbyMatch}
          <input
            type='hidden'
          />
        </div>
      `;
        });

        searchResultsWrapper += '</div>';
        document.querySelector('#hobbies-results').innerHTML = searchResultsWrapper;
      }, 250)
    );

  const renderHobby = data => {
    const results = resultsData =>
      resultsData
        .map((response, index) => {
          const hobby = response.replace(/<\/?strong>/g, '');
          return `
              <div class='user-selection-wrapper display-user-hobby' id='wrapper-${index}'>
                <div class='user-selection-content user-hobby-content' id='${hobby}'>${hobby}</div>
                <div class='user-selection-remove-wrapper'>
                  <span role='img' aria-label='close' class='user-selection-remove user-hobby-remove' id='remove-hobby-${index}'>
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
    const userSelection = document.querySelector('.user-hobbies-selection');
    userSelection.innerHTML = selection();

    document.querySelectorAll('.display-user-hobby').forEach(element => {
      element.style.cssText = `
        display: flex;
        margin-bottom: 8px;
      `;
    });

    document.querySelector('#hobbies-input').placeholder = '';

    const selectionElement = userSelection.getBoundingClientRect();
    const locationElement = document
      .querySelector(`#remove-hobby-${data.length - 1}`)
      .getBoundingClientRect();

    if (data.length === 0) {
      hobbiesInput.disabled = false;
      hobbiesInput.placeholder = hobbiesInputPlaceholder;
      document.querySelector('.hobbies').style.cssText = `padding-left: 20px`;
      hobbiesInput.focus();
    } else if (data.length < 5) {
      hobbiesInput.disabled = false;
      document.querySelector('.user-selection-container').style.cssText = `padding-left: 8px`;
      document.querySelector('.hobbies').style.cssText = `
        padding-top: ${locationElement.y - selectionElement.y + 50}px;
        padding-left: 8px;
      `;
      hobbiesInput.focus();

      removeHobbySelection();
    } else {
      document.querySelector('.hobbies').style.cssText = `
        padding-top: ${locationElement.y - selectionElement.y + 10}px;
        padding-left: 8px;
      `;
      document.querySelector('#hobbies-input').disabled = true;
      removeHobbySelection();
    }

    closeAllLists('#hobbies-input');
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

  const removeHobbySelection = () => {
    document.querySelectorAll('.user-hobby-remove').forEach(element => {
      element.addEventListener('click', el => {
        const elementId = el.currentTarget.id.split('-')[2];
        userHobbiesResults.splice(elementId, 1);
        renderHobby(userHobbiesResults);
      });
    });
  };

  hobbiesInput.addEventListener('keydown', event => {
    getUserHobbyINput();

    getKeyDirection(event, element => {
      const value = element[currentFocus].id;
      const hobbySelection = value;
      hobbiesInput.value = '';
      if (userHobbiesResults.indexOf(hobbySelection) === -1) {
        userHobbiesResults.push(hobbySelection);
      }

      renderHobby(userHobbiesResults);
    });
  });

  hobbiesResults.addEventListener('click', event => {
    const value = event.target.id;
    const hobbySelection = value;
    hobbiesInput.value = '';

    if (userHobbiesResults.indexOf(hobbySelection) === -1) {
      userHobbiesResults.push(hobbySelection);
    }

    renderHobby(userHobbiesResults);
  });
})();
