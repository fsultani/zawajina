const getQuerySelector = selector => document.querySelector(selector);

let interval;
const debounce = (callback, time) => {
  return (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      callback(...args);
    }, time);
  };
};

const FetchData = async (apiUrl, params) => {
  try {
    const response = await axios.get(apiUrl, params);
    return response.data;
  } catch (err) {
    console.error(err);
    return err.response;
  }
};

const getUserIPAddress = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (err) {
    console.error(err);
    return err;
  }
};

(() => {
  const myMatchDisplayToast = localStorage.getItem('my_match_display_toast');

  if (myMatchDisplayToast) {
    const toastData = JSON.parse(myMatchDisplayToast);

    setTimeout(() => {
      const toastElement = getQuerySelector('.toast');
      const toastMessage = getQuerySelector('.toast-message');
  
      toastElement.classList.add('show-toast');
      toastElement.classList.add('toast-success');
  
      if (toastData.type === 'success') {
        toastElement.classList.add('toast-success');
      } else (
        toastElement.classList.add('toast-error')
      )
  
      toastMessage.innerHTML = toastData.message;
  
      setTimeout(() => {
        toastElement.classList.remove('show-toast');
        localStorage.removeItem('my_match_display_toast');
      }, 3000)
    })
  }

  const lowerCaseString = string => string.split(' ').join('').toLowerCase();

  const toast = (type, message) => {
    // localStorage.setItem('my_match_display_toast', JSON.stringify({ type, message }));
    // location.reload();
    const toastElement = getQuerySelector('.toast');
    const toastMessage = getQuerySelector('.toast-message');

    toastElement.classList.add('show-toast');
    toastElement.classList.add('toast-success');

    if (type === 'success') {
      toastElement.classList.add('toast-success');
    } else (
      toastElement.classList.add('toast-error')
    )

    toastMessage.innerHTML = message;

    setTimeout(() => {
      toastElement.classList.remove('show-toast');
      // localStorage.removeItem('my_match_display_toast');
    }, 3000)
  }

  if (typeof globalThis === 'object') {
    return globalThis = {
      lowerCaseString,
      toast,
    }
  }

  Object.defineProperty(Object.prototype, '__magic__', {
    get: function () {
      return this;
    },
    configurable: true // This makes it possible to `delete` the getter later.
  });
  __magic__.globalThis = __magic__; // lolwat
  delete Object.prototype.__magic__;
})();

setTimeout(() => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  // Display slow network message for non Safari users after 5 seconds
  if (connection) {
    const type = connection.effectiveType;
    if (type === '2g' || type === '3g') {
      getQuerySelector('#slow-network-warning').style.display = 'block';
    }
  }
}, 1000);

const displayLoadingSpinner = (isLoading, formElement) => {
  const fullPageLoadingSpinner = getQuerySelector('.full-page-loading-spinner');
  const body = getQuerySelector('body');

  document.querySelectorAll('form *').forEach(item => item.disabled = isLoading);
  body.style.opacity = isLoading ? 0.9 : 1.0;
  fullPageLoadingSpinner.style.display = isLoading ? 'flex' : 'none';
}

const displaySmallLoadingSpinner = (isLoading, parentElement, childElement) => {
  const parentElementSelector = getQuerySelector(parentElement);
  const childElementSelector = getQuerySelector(childElement);

  const parentDiv = document.createElement("div");
  parentDiv.classList.add('small-loading-spinner');

  const loadingSpinnerHTML = `<div></div><div></div><div></div><div></div>`;
  parentDiv.innerHTML = loadingSpinnerHTML;

  childElementSelector.parentNode.insertBefore(parentDiv, childElementSelector);

  const loadingSpinner = getQuerySelector('.small-loading-spinner');
  loadingSpinner.style.display = isLoading ? 'flex' : 'none';

  document.querySelectorAll('form *').forEach(item => item.disabled = isLoading);
  parentElementSelector.style.opacity = isLoading ? 0.9 : 1.0;
}

const locationData = async () => {
  const userIPAddress = await getUserIPAddress();

  try {
    const data = await FetchData('/register/api/location', {
      params: {
        userIPAddress,
      },
    });
    return data;
  } catch (error) {
    document.querySelector('#application-error').style.display = 'block';
    return error.response;
  }
};

const getAllCountries = async () => {
  try {
    const data = await FetchData('/register/api/countries')
    return data;
  } catch (error) {
    return error.response;
  }
};

const getAllEthnicities = async () => {
  try {
    const data = await FetchData('/register/api/ethnicities');
    return data;
  } catch (error) {
    return error.response;
  }
};

const getAllLanguages = async () => {
  try {
    const data = await FetchData('/register/api/languages');
    return data;
  } catch (error) {
    return error.response;
  }
};

const getAllHobbies = async () => {
  try {
    const data = await FetchData('/register/api/hobbies');
    return data;
  } catch (error) {
    return error.response;
  }
};

const getGlobalThis = async () => {
  if (typeof globalThis === 'object') {
    const {
      allLocations,
      userLocationData,
    } = await locationData();

    const { countries } = await getAllCountries();
    const { allEthnicities } = await getAllEthnicities();
    const { allLanguages } = await getAllLanguages();
    const { allHobbies } = await getAllHobbies();

    displayLoadingSpinner(false);

    const allSelectFields = document.querySelectorAll('select')
    allSelectFields.forEach((field, index) => {
      field.options[0].disabled = true;
    });

    return globalThis = {
      allLocations,
      userLocationData,
      countries,
      allEthnicities,
      allLanguages,
      allHobbies,
    }
  };

  Object.defineProperty(Object.prototype, '__magic__', {
    get: function () {
      return this;
    },
    configurable: true // This makes it possible to `delete` the getter later.
  });
  __magic__.globalThis = __magic__; // lolwat
  delete Object.prototype.__magic__;
};
