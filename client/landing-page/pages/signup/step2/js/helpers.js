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

export const countriesList = () => {
  let countriesList = ["<option selected disabled>Country</option>"]
  axios.get('/register/api/all-countries')
  .then(countries => {
    countries.data.map(country => countriesList.push(`
      <option data-country-code=${country.country}>${country.country}</option>
    `))
    document.getElementById('countries-list').innerHTML = countriesList;
  })
}

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

  const getUserLocation = async () => {
    try {
      const response = await axios.get('http://ip-api.com/json');
      const { city, country, region } = response.data;
      return { city, country, region };
    } catch (err) {
      return err.response;
    }
  }
  const userLocationData = await getUserLocation();

  const getAllCountries = async () => {
    try {
      let response;
      setTimeout(() => {
        if (!response) {
          document.querySelector('#results').innerHTML = 'Loading';
        }
      }, 3000)
      response = await axios.get(`/register/api/cities-list`);
      document.querySelector('#results').innerHTML = null;
      return response.data;
    } catch (err) {
      return err.response;
    }
  }

  const allCountries = await getAllCountries();

  allCountries
    // Show closest matching cities first
    .sort(location => userLocationData && location.city === userLocationData.city ? -1 : 1)
    // Show exact matches based on city length
    .sort((a, b) => a.city.length - b.city.length)
    // Show closest matching countries
    .sort(location => userLocationData && location.country === userLocationData.country ? -1 : 1)
    // Show closest matching states
    .sort(location => userLocationData && location.state === userLocationData.region ? -1 : 1);


  const inputString = document.querySelector("#myInput")
  inputString.addEventListener("input", debounce(async event => {
    const value = inputString.value;
    const results = [];
    closeAllLists();

    if (!value) return false;
    currentFocus = -1;

    let searchResultsWrapper = '<div class="autocomplete-items">';

    // console.time("Location");
    for (let i = 0; i < allCountries.length; i++) {
      const country = allCountries[i].country === "United States" ? "USA" : allCountries[i].country;
      const fullLocation = `${allCountries[i].city}, ${allCountries[i].state ? `${allCountries[i].state}, ${country}` : country}`;

        if (fullLocation.substr(0, value.length).toUpperCase() == value.toUpperCase()) {
          const search = new RegExp(value, "gi")
          const match = fullLocation.replace(search, match => `<strong>${match}</strong>`)
          results.push({
            match,
            city: allCountries[i].city,
            state: allCountries[i].state,
            country: country,
          });
        }
    }

    if (results.length > 0) {
      const cityError = document.querySelector('#city-error');
      const isCityError = window.getComputedStyle(cityError).display;
      if (cityError !== 'none') {
        document.querySelector('#city-error').style.display = 'none';
      }
      results.slice(0, 7).map(({ match, city, state, country }) => {
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
      })

      // console.timeEnd("Location");
      searchResultsWrapper += '</div>';
      document.querySelector('#results').innerHTML = searchResultsWrapper;
    } else {
      document.querySelector('#city-error').innerHTML = 'Please enter a valid city'
      document.querySelector('#city-error').style.display = 'block'
    }

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
