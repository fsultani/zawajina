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
