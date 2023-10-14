const getQuerySelector = selector => {
  if (document.querySelectorAll(selector).length > 1) {
    console.error(`More than one selector found for ${selector}`)
  }

  return document.querySelector(selector);
}

const getQuerySelectorById = selector => {
  if (document.querySelectorAll(`#${selector}`).length > 1) {
    console.error(`More than one selector found for ID ${selector}`)
  }

  return document.getElementById(selector);
}

const addErrorClass = (element, useBottomBorder = false) => document.querySelector(`${element}`).classList.add(useBottomBorder ? 'form-error-border-bottom' : 'form-error');
const removeErrorClass = element => document.querySelector(`${element}`).classList.remove('form-error');

const inputElementError = (selector, isError, errorMessage = '') => {
  const inputHasValue = getQuerySelector(selector).value.trim().length > 0;

  if (getQuerySelector(`${selector}-wrapper`)) {
    getQuerySelector(`${selector}-wrapper`).style.cssText = `
        margin-bottom: ${isError ? '41' : '20'}px;
      `;
  }

  if (getQuerySelector(`${selector}`)) {
    getQuerySelector(`${selector}`).style.cssText = `
        border: solid 1px ${isError ? 'red' : inputHasValue ? '#006C35' : '#adadad'};
      `;
  }

  if (getQuerySelector(`${selector}-label`)) {
    getQuerySelector(`${selector}-label`).style.color = isError ? 'red' : '#006C35';
  }

  if (getQuerySelector(`${selector}-error`)) {
    getQuerySelector(`${selector}-error`).style.cssText = `
      font-size: 13px;
      color: red;
      margin-top: 3px;
      text-align: center;
      position: absolute;
      width: 100%;
    `;

    getQuerySelector(`${selector}-error`).innerHTML = errorMessage;
  }

  if (getQuerySelector(`${selector}-helper-text`)) {
    getQuerySelector(`${selector}-helper-text`).style.cssText = `
      color: ${isError ? 'red' : 'initial'}
    `;
  }
}

const formMessage = (messageType, message) => {
  const formMessageExists = getQuerySelectorById('form-error') || getQuerySelectorById('form-success');

  if (formMessageExists) formMessageExists.remove();

  const formElement = document.createElement('div');

  if (messageType === 'error') {
    formElement.setAttribute('id', 'form-error');
    Object.assign(formElement.style, {
      display: "block",
      position: "relative",
      padding: "0.75rem 1.25rem",
      marginBottom: "1rem",
      border: "1px solid transparent",
      borderRadius: "0.25rem",
      textAlign: "center",
      fontSize: "16px",
      color: "#721c24",
      backgroundColor: "#f8d7da",
      borderColor: "#f5c6cb"
    })

    formElement.innerHTML = message || 'There was an error. Please try again later.';
  } else {
    formElement.setAttribute('id', 'form-success');
    Object.assign(formElement.style, {
      display: "block",
      position: "relative",
      padding: "0.75rem 1.25rem",
      marginBottom: "1rem",
      border: "1px solid transparent",
      borderRadius: "0.25rem",
      textAlign: "center",
      fontSize: "16px",
      color: "var(--color-green)",
      backgroundColor: "var(--color-light-green)"
    })

    formElement.innerHTML = message;
  }

  formElement.style.display = 'block';

  const pageWrapperElement = getQuerySelector('.page-wrapper')
  pageWrapperElement.prepend(formElement);
}

const lowerCaseString = string => string.split(' ').join('').toLowerCase();

const invalidCharactersRegExp = /[<>]/;
const webLinksRegExp = /.*https?.*/;
const htmlRegExp = /[&<>"'\/\n]/g;
const htmlEscapesRegExp = /(&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;|<br>)/ig;
const phoneNumberRegExp = /\d{6,}/;

const rawInput = string => string
  .split(' ')
  .join('')
  .toLowerCase()
  .replace(/\./g, '')
  .replace(/,/g, '')
  .replace(htmlRegExp, '');

const checkForSocialMedia = string => {
  /*
    First split the string by paragraphs to get an array of paragraphs.
    Then, split each array element by different possible separators.
  */
  const originalString = string.toLowerCase().split('\n').join(' ').split(/[.\s:[&<>"'\/]+/);
  const arrayOfWords = [];

  for (index = 0; index < originalString.length; index++) {
    if (originalString[index].length === 1 && originalString[index + 1]?.length === 1) {
      arrayOfWords.push(originalString[index] + originalString[index + 1]);
      index++;
    } else {
      arrayOfWords.push(originalString[index]);
    }
  }

  const finalString = arrayOfWords.map(paragraph => paragraph.split(/[.\s:[&<>"'\/]+/))
    .flat()
    .map(word => word
      .replace(/\./g, '')
      .replace(/,/g, '')
      .replace(htmlRegExp, '')
    );

  return finalString;
}

const socialMediaAccounts = [
  'facebook',
  'whatsapp',
  'googlehangouts',
  'hangouts',
  'instagram',
  'snapchat',
  'viber',
  'telegram',
  'kakaotalk',
  'kik',
  '@',
];

const socialMediaTags = [
  'fb',
  'insta',
  'ig',
  'snap',
];

const inputHasSocialMediaAccount = string => socialMediaAccounts.some(item => rawInput(string).includes(item));
const inputHasSocialMediaTag = string => socialMediaTags.some(item => checkForSocialMedia(string).includes(item));
const inputHasPhoneNumber = string => phoneNumberRegExp.test(string);
const invalidString = string => invalidCharactersRegExp.test(string);
const preventWebLinks = string => webLinksRegExp.test(string);
const replaceBreakTag = string => '' + string.replace(/<br>/g, '\n');

let interval;
const debounce = (callback, time) => {
  return (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      callback(...args);
    }, time);
  };
};

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

const sentenceCaseToCamelCase = string => string.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index == 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');

const showModal = ({ modalHeader, modalBody, modalButton, customStyles = [], canCloseModal = true, submitFormCallback }) => {
  const modalHTML = getQuerySelector('.modal');
  Object.assign(modalHTML.style, {
    display: 'flex',
  });

  const modalContentHTML = getQuerySelector('.modal-content');
  Object.assign(modalContentHTML.style, {
    animation: 'animation-show-modal 0.5s',
  });

  const modalFormHTML = getQuerySelector('.modal-form');
  Object.assign(modalFormHTML.style, {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  });

  const modalHeaderHTML = getQuerySelector('.modal-header');
  Object.assign(modalHeaderHTML.style, {
    width: '100%',
    borderBottom: '1px solid #adadad',
    textAlign: 'center',
    paddingBottom: '5px',
  });

  modalHeaderHTML.innerHTML = modalHeader;

  const modalBodyHTML = getQuerySelector('.modal-body');
  Object.assign(modalBodyHTML.style, {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '25px 0',
    width: '100%',
  });
  modalBodyHTML.innerHTML = modalBody;

  const modalButtonHTML = getQuerySelector('#modal-form-submit');
  Object.assign(modalButtonHTML.style, {
    width: "100%",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "12px",
    backgroundColor: "#006C35",
    border: "transparent",
    boxSizing: "border-box",
    outline: "none",
    color: "#ffffff",
    boxShadow:
      "0 2px 10px 0 rgba(0, 0, 0, 0.14),\n    0 4px 5px -5px rgba(0, 0, 0, 0.5)",
    letterSpacing: "0.5px",
    fontSize: "16px"
  });
  modalButtonHTML.innerHTML = modalButton;

  customStyles.map(customStyle => {
    const elements = document.querySelectorAll(customStyle.element);

    if (elements.length > 1) {
      elements.forEach((item, index) => {
        Object.assign(item.style, {
          ...customStyle.styles,
        });
      });
    } else {
      const element = getQuerySelector(customStyle.element);
      Object.assign(element.style, {
        ...customStyle.styles,
      })
    }
  })

  if (canCloseModal) {
    window.onclick = function (event) {
      if (event.target == modalHTML) {
        closeModal();
      }
    }

    window.addEventListener('keyup', event => {
      if (event.key === 'Escape') {
        closeModal();
      }
    })
  } else {
    const closeModalButton = getQuerySelector('.close-modal');
    closeModalButton.style.display = 'none';

    getQuerySelector('html').style.cursor = 'not-allowed';
    getQuerySelector('.navbar--site-header-inner').style.pointerEvents = 'none';

    modalHTML.style.cursor = 'auto';
    modalHTML.style.pointerEvents = 'auto';
  }

  const modalForm = document.forms.namedItem('modal-form');
  modalForm.onsubmit = event => {
    event.preventDefault();
    isSubmitting('modal-button-loading-spinner-wrapper', true);
    submitFormCallback();
  }
}

const closeModal = () => {
  const modal = getQuerySelector('.modal')
  Object.assign(modal.style, {
    display: 'none',
  });

  document.querySelectorAll('.modal-section').forEach(element => {
    Object.assign(element.style, {
      display: 'none',
    })
  });

  document.querySelectorAll('form').forEach(form => form.reset());
}

(async () => {
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

  CheckIPAddress();
})();
