export const birthDay = () => {
  const dayOptions = ["<option selected disabled>Day</option>"]
  const res = [...Array(31)].map((_, i) => dayOptions.push(`<option>${i + 1}</option>`))
  document.getElementById('dob-day').innerHTML = dayOptions;
};

export const birthYear = () => {
  const today = new Date();
  const age18 = today.getFullYear() - 18;

  let yearOptions = ["<option selected disabled>Year</option>"]
  const res = [...Array(100)].map((_, i) => yearOptions.push(`<option>${age18 - i}</option>`));
  document.getElementById('dob-year').innerHTML = yearOptions;
};

// https://davidwalsh.name/javascript-debounce-function
const debounce = (func, wait, immediate) => {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
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
  const inputString = document.querySelector("#myInput")
  /*close all autocomplete lists in the document,
  except the one passed as an argument:*/
  var x = document.getElementsByClassName("autocomplete-items");
  for (var i = 0; i < x.length; i++) {
    if (element != x[i] && element != inputString) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}

const removeActive = (x) => {
  /*a function to remove the "active" class from all autocomplete items:*/
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("autocomplete-active");
  }
}

const addActive = (element, currentFocus) => {
  /*a function to classify an item as "active":*/
  if (!element) return false;
  /*start by removing the "active" class on all items:*/
  removeActive(element);
  if (currentFocus >= element.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = (element.length - 1);
  /*add class "autocomplete-active":*/
  element[currentFocus].classList.add("autocomplete-active");
}

export const userLocation = async () => {
  let currentFocus;

  const getUserIPAddress = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (err) {
      console.error(err)
      return err;
    }
  }
  const userIPAddress = await getUserIPAddress();

  const getAllCountries = async userInput => {
    try {
      let response;
      setTimeout(() => {
        if (!response) {
          document.querySelector('.overlay').style.backgroundColor = 'rgba(0,0,0,0.5)';
          document.querySelector('.overlay').style.opacity = 0.5;
          document.querySelector('.user-location-loading-spinner').style.display = 'inline-block';
        }
      }, 1000)
      response = await axios.get(`/register/api/cities-list`, {
        params: {
          userIPAddress,
          userInput
        }
      });
      document.querySelector('.overlay').style.backgroundColor = '#ffffff';
      document.querySelector('.overlay').style.opacity = 1;
      document.querySelector('.user-location-loading-spinner').style.display = 'none';
      return response.data;
    } catch (err) {
      console.error(err)
      document.querySelector('.overlay').style.backgroundColor = '#ffffff';
      document.querySelector('.overlay').style.opacity = 1;
      document.querySelector('.user-location-loading-spinner').style.display = 'none';
      return err.response;
    }
  }

  // const results = await getAllCountries();
  // console.log('results:\n', results)
  const inputString = document.querySelector("#myInput");
  inputString.addEventListener("input", debounce(async event => {
    const userInput = inputString.value;
    const results = await getAllCountries(userInput);
    console.log('results:\n', results)

    closeAllLists();

    if (!userInput) return false;
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
      `
    });

    searchResultsWrapper += '</div>';
    document.querySelector('#results').innerHTML = searchResultsWrapper;
  }, 250))

  inputString.addEventListener("keydown", event => {
    let element = document.querySelector('.autocomplete-items');
    if (element) {
      element = element.getElementsByTagName('div')
    }
    if (event.key === "ArrowDown") {
      currentFocus++;
      addActive(element, currentFocus)
    } else if (event.key === "ArrowUp") {
      currentFocus--;
      addActive(element, currentFocus);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (currentFocus > -1) {
        if (element) {
          const value = element[currentFocus].getElementsByTagName('input')[0];
          const city = value.dataset.city
          const state = value.dataset.state
          const country = value.dataset.country
          const selection = `${city}, ${state !== "null" ? `${state}, ${country}` : country}`
          inputString.value = selection;
          closeAllLists();

          inputString.setAttribute('data-city', city)
          inputString.setAttribute('data-state', state)
          inputString.setAttribute('data-country', country)
        }
      }
    }
  })

  document.addEventListener('click', event => {
    const inputTag = event.target.dataset;
    if (inputTag?.city) {
      const city = inputTag.city
      const state = inputTag.state
      const country = inputTag.country
      const selection = `${city}, ${state !== "null" ? `${state}, ${country}` : country}`
      inputString.value = selection;
      closeAllLists();

      inputString.setAttribute('data-city', city)
      inputString.setAttribute('data-state', state)
      inputString.setAttribute('data-country', country)
    }
  })
}
