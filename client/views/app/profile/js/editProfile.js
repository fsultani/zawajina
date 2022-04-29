const modal = getQuerySelector('.modal');
const modalContent = getQuerySelector('.modal-content');

const editButtons = [...document.querySelectorAll(`[data-name='edit-button']`)];
const allAttributes = [...document.querySelectorAll(`[data-modal-section]`)];

let parentElementAttribute;

let locationData;
let languages = [];

let editAboutMe = false;
let editAboutMyMatch = false;

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

    button.onclick = () => {
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
