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

const camelCaseToSnakeCase = string => string.replace(/\.?([A-Z])/g, function (x, y) { return "_" + y.toLowerCase() }).replace(/^_/, "");

// const displayLoadingSpinner = (isLoading) => {
//   const fullPageLoadingSpinner = document.querySelector('.full-page-loading-spinner');
//   const signupContent = document.querySelector('.signup-content');

//   document.querySelectorAll('form *').forEach(item => item.disabled = isLoading);
//   signupContent.style.opacity = isLoading ? 0.9 : 1.0;
//   fullPageLoadingSpinner.style.display = isLoading ? 'flex' : 'none';
// }

// (async () => {
//   displayLoadingSpinner(true);

//   const userIPAddress = await getUserIPAddress();
//   const locationData = async () => {
//     try {
//       const data = await FetchData('/register/api/location', {
//         params: {
//           userIPAddress,
//         },
//       });
//       return data;
//     } catch (error) {
//       console.log(`error\n`, error);
//       document.querySelector('#application-error').style.display = 'block';
//       return error.response;
//     }
//   };

//   const getAllCountries = async () => {
//     try {
//       const data = await FetchData('/register/api/countries')
//       return data;
//     } catch (error) {
//       return error.response;
//     }
//   };

//   const getAllEthnicities = async userInput => {
//     try {
//       const data = await FetchData('/register/api/ethnicities');
//       return data;
//     } catch (error) {
//       return error.response;
//     }
//   };

//   const getAllLanguages = async userInput => {
//     try {
//       const data = await FetchData('/register/api/languages');
//       return data;
//     } catch (error) {
//       return error.response;
//     }
//   };

//   const getAllHobbies = async userInput => {
//     try {
//       const data = await FetchData('/register/api/hobbies');
//       return data;
//     } catch (error) {
//       return error.response;
//     }
//   };

//   if (typeof globalThis === 'object') {
//     const {
//       allLocations,
//       userLocationData,
//     } = await locationData();

//     const { countries } = await getAllCountries();
//     const { allEthnicities } = await getAllEthnicities();
//     const { allLanguages } = await getAllLanguages();
//     const { allHobbies } = await getAllHobbies();

//     displayLoadingSpinner(false);

//     return globalThis = {
//       allLocations,
//       userLocationData,
//       countries,
//       allEthnicities,
//       allLanguages,
//       allHobbies,
//     }
//   };

//   Object.defineProperty(Object.prototype, '__magic__', {
//     get: function () {
//       return this;
//     },
//     configurable: true // This makes it possible to `delete` the getter later.
//   });
//   __magic__.globalThis = __magic__; // lolwat
//   delete Object.prototype.__magic__;
// })();
