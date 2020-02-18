!function handleFocusEvent() {
  // Grab all class names of 'input100'
  const elements = document.getElementsByClassName('input100')

  /* Return an array from the HTMLCollections object */
  allElements = Array.from(elements);
  allElements.map(element => {
    element.addEventListener('blur', () => {
      if (element.value.trim() !== "") {
        element.classList.add("has-val");
      } else {
        element.classList.remove("has-val");
      }
    })
  })
}();
