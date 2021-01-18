const birthDayOptions = ["<option selected disabled>Day</option>"];
[...Array(31)].map((_, i) => birthDayOptions.push(`<option>${i + 1}</option>`));
document.querySelector("#dob-day").innerHTML = birthDayOptions;

const today = new Date();
const age18 = today.getFullYear() - 18;

let birthYearOptions = ["<option selected disabled>Year</option>"];
[...Array(100)].map((_, i) => birthYearOptions.push(`<option>${age18 - i}</option>`));
document.querySelector("#dob-year").innerHTML = birthYearOptions;

// https://davidwalsh.name/javascript-debounce-function
const debounce = (func, wait, immediate) => {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

const closeAllLists = element => {
  const inputString = document.querySelector(element);
  /*close all autocomplete lists in the document,
  except the one passed as an argument:*/
  var x = document.getElementsByClassName("autocomplete-items");
  for (var i = 0; i < x.length; i++) {
    if (element != x[i] && element != inputString) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
};

const removeActive = x => {
  /*a function to remove the "active" class from all autocomplete items:*/
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("autocomplete-active");
  }
};

const addActive = (element, currentFocus) => {
  /*a function to classify an item as "active":*/
  if (!element) return false;
  /*start by removing the "active" class on all items:*/
  removeActive(element);
  if (currentFocus >= element.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = element.length - 1;
  /*add class "autocomplete-active":*/
  element[currentFocus].classList.add("autocomplete-active");
};

(async () => {
  document.querySelector('#locationInput').placeholder = 'What city do you live in?';

  let currentFocus;

  const getUserIPAddress = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip;
    } catch (err) {
      console.error(err);
      return err;
    }
  };

  const userIPAddress = await getUserIPAddress();

  const getAllCountries = async userInput => {
    try {
      let response;
      setTimeout(() => {
        if (!response) {
          document.querySelector("body").style.backgroundColor = "rgba(0,0,0,0.5)";
          document.querySelector("body").style.opacity = 0.5;
          document.querySelector(".full-page-loading-spinner").style.display = "inline-block";
        }
      }, 1000);
      response = await axios.get(`/register/api/cities-list`, {
        params: {
          userIPAddress,
          userInput,
        },
      });
      document.querySelector("body").style.backgroundColor = "#ffffff";
      document.querySelector("body").style.opacity = 1;
      document.querySelector(".full-page-loading-spinner").style.display = "none";
      return response.data;
    } catch (err) {
      console.error(err);
      document.querySelector("body").style.backgroundColor = "#ffffff";
      document.querySelector("body").style.opacity = 1;
      document.querySelector(".full-page-loading-spinner").style.display = "none";
      return err.response;
    }
  };

  const locationInputString = document.querySelector("#locationInput");
  const run = () => locationInputString.addEventListener(
    "input",
    debounce(async event => {
      const userInput = locationInputString.value;
      if (!userInput) {
        closeAllLists("#locationInput");
        locationInputString.setAttribute("data-city", "");
        locationInputString.setAttribute("data-state", "");
        locationInputString.setAttribute("data-country", "");
        return false;
      }

      // console.time("/api/cities-list");
      const results = await getAllCountries(userInput);
      // console.timeEnd("/api/cities-list");
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

      searchResultsWrapper += "</div>";
      document.querySelector("#location-results").innerHTML = searchResultsWrapper;
    }, 250)
  );

  document.querySelector('#location-results').addEventListener("click", event => {
    const inputTag = event.target.dataset;
    if (inputTag?.city) {
      const city = inputTag.city;
      const state = inputTag.state;
      const country = inputTag.country;
      const locationSelection = `${city}, ${state !== "null" ? `${state}, ${country}` : country}`;
      locationInputString.value = '';

      const removeLocationSelection = () => {
        document.querySelector('.user-location-remove').addEventListener('click', () => {
          locationInputString.removeAttribute("data-city");
          locationInputString.removeAttribute("data-state");
          locationInputString.removeAttribute("data-country");

          document.querySelector('.display-user-location').style.display = 'none';
          document.querySelector('#locationInput').placeholder = 'What city do you live in?';
          document.querySelector('#locationInput').disabled = false;
          locationInputString.focus();
        })
      }

      const render = data => {
        const selection = `
          <div class="user-selection-container">
            <div class="user-selection-wrapper display-user-location">
              <div class="user-selection-content user-location-content">${data}</div>
              <div class="user-selection-remove-wrapper">
                <span role="img" aria-label="close" class="user-selection-remove user-location-remove">
                  <svg viewBox="64 64 896 896" focusable="false" data-icon="close" width="10px" height="10px" fill="currentColor" aria-hidden="true">
                    <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>`

        const userSelection = document.querySelector('.user-location-selection');
        userSelection.innerHTML = selection;
        document.querySelector('.display-user-location').style.display = 'flex';
        document.querySelector('#locationInput').placeholder = '';
        document.querySelector('#locationInput').disabled = true;
        closeAllLists("#locationInput");

        locationInputString.setAttribute("data-city", city);
        locationInputString.setAttribute("data-state", state);
        locationInputString.setAttribute("data-country", country);

        removeLocationSelection();
      }

      render(locationSelection);
    }
  });

  locationInputString.addEventListener("keydown", event => {
    run();
    let element = document.querySelector(".autocomplete-items");
    if (element) {
      element = element.getElementsByTagName("div");
    }
    if (event.key === "ArrowDown") {
      currentFocus++;
      addActive(element, currentFocus);
    } else if (event.key === "ArrowUp") {
      currentFocus--;
      addActive(element, currentFocus);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (currentFocus > -1) {
        if (element) {
          const value = element[currentFocus].getElementsByTagName("input")[0];
          const city = value.dataset.city;
          const state = value.dataset.state;
          const country = value.dataset.country;
          const locationSelection = `${city}, ${state !== "null" ? `${state}, ${country}` : country}`;
          locationInputString.value = '';

          const removeLocationSelection = () => {
            document.querySelector('.user-location-remove').addEventListener('click', () => {
              locationInputString.removeAttribute("data-city");
              locationInputString.removeAttribute("data-state");
              locationInputString.removeAttribute("data-country");

              document.querySelector('.display-user-location').style.display = 'none';
              document.querySelector('#locationInput').placeholder = 'What city do you live in?';
              document.querySelector('#locationInput').disabled = false;
              locationInputString.focus();
            })
          }

          const render = data => {
            const selection = `
              <div class="user-selection-container">
                <div class="user-selection-wrapper display-user-location">
                  <div class="user-selection-content user-location-content">${data}</div>
                  <div class="user-selection-remove-wrapper">
                    <span role="img" aria-label="close" class="user-selection-remove user-location-remove">
                      <svg viewBox="64 64 896 896" focusable="false" data-icon="close" width="10px" height="10px" fill="currentColor" aria-hidden="true">
                        <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>`

            const userSelection = document.querySelector('.user-location-selection');
            userSelection.innerHTML = selection;
            document.querySelector('.display-user-location').style.display = 'flex';
            document.querySelector('#locationInput').placeholder = '';
            document.querySelector('#locationInput').disabled = true;
            closeAllLists("#locationInput");

            locationInputString.setAttribute("data-city", city);
            locationInputString.setAttribute("data-state", state);
            locationInputString.setAttribute("data-country", country);

            removeLocationSelection();
          }

          render(locationSelection);
        }
      }
    }
  });
})();

(async () => {
  const ethnicityPlaceholder = 'What is your ethnicity? (Select up to 2)';
  document.querySelector('#ethnicityInput').placeholder = ethnicityPlaceholder;
  const userEthnicityResults = [];
  let currentFocus;
  let userEthnicitySelection = '';

  const getAllEthnicities = async userInput => {
    try {
      let response;
      setTimeout(() => {
        if (!response) {
          document.querySelector("body").style.backgroundColor = "rgba(0,0,0,0.5)";
          document.querySelector("body").style.opacity = 0.5;
          document.querySelector(".full-page-loading-spinner").style.display = "inline-block";
        }
      }, 1000);
      response = await axios.get(`/register/api/ethnicities-list`, {
        params: {
          userInput,
        },
      });
      document.querySelector("body").style.backgroundColor = "#ffffff";
      document.querySelector("body").style.opacity = 1;
      document.querySelector(".full-page-loading-spinner").style.display = "none";
      return response.data;
    } catch (err) {
      console.error(err);
      document.querySelector("body").style.backgroundColor = "#ffffff";
      document.querySelector("body").style.opacity = 1;
      document.querySelector(".full-page-loading-spinner").style.display = "none";
      return err.response;
    }
  };

  const ethnicityInputString = document.querySelector("#ethnicityInput");
  const run = () => ethnicityInputString.addEventListener(
    "input",
    debounce(async event => {
      const userInput = ethnicityInputString.value;
      if (!userInput) {
        closeAllLists("#ethnicityInput");
        return false;
      }

      const results = await getAllEthnicities(userInput);
      currentFocus = -1;

      let searchResultsWrapper = '<div class="autocomplete-items">';

      results.map(ethnicity => {
        searchResultsWrapper += `
        <div
          id="${ethnicity}"
        >
          ${ethnicity}
          <input
            type='hidden'
          />
        </div>
      `;
      });

      searchResultsWrapper += "</div>";
      document.querySelector("#ethnicity-results").innerHTML = searchResultsWrapper;
    }, 250)
  );

  document.querySelector('#ethnicity-results').addEventListener('click', event => {
    const value = event.target.id;
    const ethnicitySelection = value;
    ethnicityInputString.value = '';

    userEthnicityResults.push(ethnicitySelection);

    const removeEthnicitySelection = () => {
      document.querySelectorAll('.user-selection-remove').forEach(element => {
        element.addEventListener('click', el => {
          const elementId = el.currentTarget.id.split('-')[1];
          console.log('elementId:\n', elementId);
          userEthnicityResults.splice(elementId, 1);
          console.log('userEthnicityResults:\n', userEthnicityResults);
          render(userEthnicityResults)
        })
      });
    }

    const render = (data) => {
      const resultsDiv = results => results.map((response, index) => (
        `<div class="user-selection-wrapper display-user-ethnicity" id="wrapper-${index}">
          <div class="user-selection-content user-ethnicity-content" id="${response}">${response}</div>
          <div class="user-selection-remove-wrapper">
            <span role="img" aria-label="close" class="user-selection-remove user-ethnicity-remove" id="remove-${index}">
              <svg viewBox="64 64 896 896" focusable="false" data-icon="close" width="10px" height="10px" fill="currentColor" aria-hidden="true">
                <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
              </svg>
            </span>
          </div>
        </div>`
      )).join('');

      const selection = () => `
        <div class="user-selection-container">
          ${resultsDiv(data)}
        </div>
      `
      const userSelection = document.querySelector('.user-ethnicity-selection');
      userSelection.innerHTML = selection();

      document.querySelectorAll('.display-user-ethnicity').forEach(element => {
        element.style.display = 'flex';
      });

      document.querySelector('#ethnicityInput').placeholder = '';

      if (data.length === 0) {
        document.querySelector('#ethnicityInput').disabled = false;
        document.querySelector('#ethnicityInput').placeholder = ethnicityPlaceholder;
        document.querySelector('.ethnicity').style.cssText = `padding-left: 20px`;
        ethnicityInputString.focus();
      } else if (data.length === 1) {
        document.querySelector('#ethnicityInput').disabled = false;
        const selectionElement = document.querySelector('.user-ethnicity-selection').getBoundingClientRect()
        let locationElement = document.querySelector(`#remove-${data.length - 1}`).getBoundingClientRect()

        document.querySelector('.ethnicity').style.cssText = `padding-left: ${locationElement.x - selectionElement.x + 30}px`;
        ethnicityInputString.focus();

        removeEthnicitySelection();
      } else {
        document.querySelector('#ethnicityInput').disabled = true;
        const selectionElement = document.querySelector('.user-ethnicity-selection').getBoundingClientRect()
        let locationElement = document.querySelector(`#remove-${data.length - 1}`).getBoundingClientRect()

        document.querySelector('.ethnicity').style.cssText = `padding-left: ${locationElement.x - selectionElement.x + 30}px`;
        removeEthnicitySelection();
      }

      closeAllLists("#ethnicityInput");
    }

    render(userEthnicityResults);
  })

  ethnicityInputString.addEventListener("keydown", event => {
    run();
    let element = document.querySelector(".autocomplete-items");
    if (element) {
      element = element.getElementsByTagName("div");
    }
    if (event.key === "ArrowDown") {
      currentFocus++;
      addActive(element, currentFocus);
    } else if (event.key === "ArrowUp") {
      currentFocus--;
      addActive(element, currentFocus);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (currentFocus > -1) {
        if (element) {
          const value = element[currentFocus].id;
          const ethnicitySelection = value;
          ethnicityInputString.value = '';

          userEthnicityResults.push(ethnicitySelection);

          const removeEthnicitySelection = () => {
            document.querySelectorAll('.user-selection-remove').forEach(element => {
              element.addEventListener('click', el => {
                const elementId = el.currentTarget.id.split('-')[1];
                userEthnicityResults.splice(elementId, 1);
                render(userEthnicityResults)
              })
            });
          }

          const render = (data) => {
            const resultsDiv = results => results.map((response, index) => (
              `<div class="user-selection-wrapper display-user-ethnicity" id="wrapper-${index}">
                <div class="user-selection-content user-ethnicity-content" id="${response}">${response}</div>
                <div class="user-selection-remove-wrapper">
                  <span role="img" aria-label="close" class="user-selection-remove user-ethnicity-remove" id="remove-${index}">
                    <svg viewBox="64 64 896 896" focusable="false" data-icon="close" width="10px" height="10px" fill="currentColor" aria-hidden="true">
                      <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                    </svg>
                  </span>
                </div>
              </div>`
            )).join('');

            const selection = () => `
              <div class="user-selection-container">
                ${resultsDiv(data)}
              </div>
            `
            const userSelection = document.querySelector('.user-ethnicity-selection');
            userSelection.innerHTML = selection();

            document.querySelectorAll('.display-user-ethnicity').forEach(element => {
              element.style.display = 'flex';
            });

            document.querySelector('#ethnicityInput').placeholder = '';

            if (data.length === 0) {
              document.querySelector('#ethnicityInput').disabled = false;
              document.querySelector('#ethnicityInput').placeholder = ethnicityPlaceholder;
              document.querySelector('.ethnicity').style.cssText = `padding-left: 20px`;
              ethnicityInputString.focus();
            } else if (data.length === 1) {
              document.querySelector('#ethnicityInput').disabled = false;
              const selectionElement = document.querySelector('.user-ethnicity-selection').getBoundingClientRect()
              let locationElement = document.querySelector(`#remove-${data.length - 1}`).getBoundingClientRect()

              document.querySelector('.ethnicity').style.cssText = `padding-left: ${locationElement.x - selectionElement.x + 30}px`;
              ethnicityInputString.focus();

              removeEthnicitySelection();
            } else {
              document.querySelector('#ethnicityInput').disabled = true;
              const selectionElement = document.querySelector('.user-ethnicity-selection').getBoundingClientRect()
              let locationElement = document.querySelector(`#remove-${data.length - 1}`).getBoundingClientRect()

              document.querySelector('.ethnicity').style.cssText = `padding-left: ${locationElement.x - selectionElement.x + 30}px`;
              removeEthnicitySelection();
            }

            closeAllLists("#ethnicityInput");
          }

          render(userEthnicityResults);
        }
      }
    }
  });
})();
