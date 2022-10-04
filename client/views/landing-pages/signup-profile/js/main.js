axios.get('/register/api/signup-user-first-name').then(res => {
  document.querySelector('.form-title').innerHTML = `Welcome, ${res.data.name}`;
}).catch(err => {
  if (err instanceof TypeError) {
    console.error(err);
  } else {
    Cookies.remove('my_match_authToken');
    Cookies.remove('my_match_userId');
    window.location.pathname = '/signup';
  }
});

(() => {
  document.getElementById('about-me').addEventListener('keyup', e => {
    let characterCount = e.target.value.length;
    document.getElementById('about-me-character-count').innerHTML = `${characterCount}/100`;
    document.getElementById('about-me-character-count').style.cssText =
      characterCount < 100 ? 'color: #777;' : 'color: green;';
  });

  document.getElementById('about-my-match').addEventListener('keyup', e => {
    let characterCount = e.target.value.length;
    document.getElementById('about-my-match-character-count').innerHTML = `${characterCount}/100`;
    document.getElementById('about-my-match-character-count').style.cssText =
      characterCount < 100 ? 'color: #777;' : 'color: green;';
  });
})();

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

//     const allSelectFields = document.querySelectorAll('select')
//     allSelectFields.forEach((field, index) => {
//       field.options[0].disabled = true;
//     });

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
