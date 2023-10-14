// Grab all input html tags
const elements = document.getElementsByClassName('form-input-wrapper')

/* Return an array from the HTMLCollections object */
const allElements = Array.from(elements);
allElements.map(element => {
  Array.from(element.children).map(child => {
    if (child.tagName === 'INPUT') {
      child.addEventListener('blur', () => {
        if (child.value.trim().length > 0) {
          element.classList.add('input-has-value');
        } else {
          element.classList.remove('input-has-value');
        }
      });
    }
  })
});
