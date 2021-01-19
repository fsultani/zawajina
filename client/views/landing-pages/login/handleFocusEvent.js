// Grab all class names of 'input-field'
const elements = document.getElementsByClassName('input-field');

/* Return an array from the HTMLCollections object */
allElements = Array.from(elements);
allElements.map(element => {
  element.addEventListener('blur', () => {
    if (element.value.trim() !== '') {
      element.classList.add('has-value');
    } else {
      element.classList.remove('has-value');
    }
  });
});
