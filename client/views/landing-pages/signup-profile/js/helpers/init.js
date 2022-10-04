const closeAllLists = element => {
  const inputString = document.querySelector(element);
  /*
    Close all autocomplete lists in the document, except the one passed as an argument
  */
  var x = document.getElementsByClassName('autocomplete-items');
  for (var i = 0; i < x.length; i++) {
    if (element != x[i] && element != inputString) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
};

const removeActive = x => {
  /*
    A function to remove the 'active' class from all autocomplete items
  */
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove('autocomplete-active');
  }
};

const addActive = (element, currentFocus) => {
  /*
    A function to classify an item as 'active'
  */
  if (!element) return false;
  /*
    Start by removing the 'active' class on all items
  */
  removeActive(element);
  if (currentFocus >= element.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = element.length - 1;
  /*
    Add class 'autocomplete-active'
  */
  element[currentFocus].classList.add('autocomplete-active');
};

(async () => {
  displayLoadingSpinner(true);

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
})();
