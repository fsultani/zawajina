// Grab all class names of 'form-input'
const elements = document.getElementsByClassName("form-input");

/* Return an array from the HTMLCollections object */
const allElements = Array.from(elements);
allElements.map(element => {
  element.addEventListener("blur", () => {
    if (element.value.trim() !== "") {
      element.classList.add("has-value");
    } else {
      element.classList.remove("has-value");
    }
  });
});
