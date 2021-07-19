const debounce = (callback, time) => {
  let interval;
  return (...args) => {
    clearTimeout(interval);
    interval = setTimeout(() => {
      interval = null;
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

const FetchData = async (apiUrl, params) => {
  try {
    const response = await axios.get(apiUrl, params);
    return response.data;
  } catch (err) {
    console.error(err);
    return err.response;
  }
};

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
