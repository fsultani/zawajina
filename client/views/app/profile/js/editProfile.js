const modal = getQuerySelector('.modal');
const modalContent = getQuerySelector('.modal-content');

const editButtons = [...document.querySelectorAll(`[data-name='edit-button']`)];
const allAttributes = [...document.querySelectorAll(`[data-modal-section]`)];

let parentElementAttribute;

let locationData;
let languages = [];

let editAboutMe = false;
let editAboutMyMatch = false;

const displayLoadingSpinner = (isLoading) => {
  const fullPageLoadingSpinner = document.querySelector('.modal-loading-spinner');
  const content = document.querySelector('.modal-content');

  document.querySelectorAll('form *').forEach(item => item.disabled = isLoading);
  content.style.opacity = isLoading ? 0.9 : 1.0;
  fullPageLoadingSpinner.style.display = isLoading ? 'flex' : 'none';
}

const getLocationData = async () => {
  displayLoadingSpinner(true);

  const userIPAddress = await getUserIPAddress();
  const locationData = async () => {
    try {
      const data = await FetchData('/register/api/location', {
        params: {
          userIPAddress,
        },
      });
      return data;
    } catch (error) {
      console.log(`error\n`, error);
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

  const getAllEthnicities = async userInput => {
    try {
      const data = await FetchData('/register/api/ethnicities');
      return data;
    } catch (error) {
      return error.response;
    }
  };

  const getAllLanguages = async userInput => {
    try {
      const data = await FetchData('/register/api/languages');
      return data;
    } catch (error) {
      return error.response;
    }
  };

  const getAllHobbies = async userInput => {
    try {
      const data = await FetchData('/register/api/hobbies');
      return data;
    } catch (error) {
      return error.response;
    }
  };

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
}

const editProfile = () => {
  Array.from(editButtons, (_, index) => {
    const parentElement = editButtons[index];

    const div = document.createElement('div');
    const button = document.createElement('button');

    div.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
    `;

    button.innerHTML = 'Edit';
    button.style.cssText = `
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 12px;
      background-color: #008cff;
      border: transparent;
      box-sizing: border-box;
      outline: none;
      color: #ffffff;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.14), 0 4px 5px -5px rgba(0, 0, 0, 0.5);
      letter-spacing: 1px;
      font-size: 16px;
      border-radius: 5px;
      padding: 5px 20px;
    `;

    div.appendChild(button);
    parentElement.appendChild(div);

    button.onclick = async () => {
      parentElementAttribute = parentElement.getAttribute('data-section');

      allAttributes.map(item => {
        const itemAttribute = item.getAttribute('data-modal-section')
        if (itemAttribute === parentElementAttribute) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      })

      modal.style.display = 'block';
      modalContent.style.cssText = `
        opacity: 1;
        z-index: 2;
        animation: show .3s;
      `;

      switch (parentElementAttribute) {
        case 'location':
          await getLocationData();
          locationHelper();
          break;
        case 'user-details':
          userDetailsHelper();
          break;
        case 'about-me':
          editAboutMe = true;
          aboutMeHelper({ reset: false });
          break;
        case 'about-match':
          editAboutMyMatch = true;
          aboutMyMatchHelper({ reset: false });
          break;
        default:
          break;
      }

      const allInputFields = document.querySelectorAll('input[type=text]')
      allInputFields.forEach(field => field.blur());
    }

    const closeModal = () => {
      modalContent.style.cssText = `
        z-index: -1;
        opacity: 0;
        animation: hide .2s;
      `;

      if (parentElementAttribute === 'about-me') {
        editAboutMe = false;
        aboutMeHelper({ reset: true });
      } else if (parentElementAttribute === 'about-match') {
        editAboutMyMatch = false;
        aboutMyMatchHelper({ reset: true });
      }

      setTimeout(() => {
        modal.style.display = 'none';

        allAttributes.map(item => {
          item.style.display = 'none';
        })
      }, 200)
    }

    const modalClose = document.querySelector('.close')
    modalClose.onclick = () => {
      closeModal();
    }

    window.onclick = function (event) {
      if (event.target == modal) {
        closeModal();
      }
    }

    window.addEventListener('keyup', event => {
      if (event.key === 'Escape') {
        closeModal();
      }
    })
  })
}
