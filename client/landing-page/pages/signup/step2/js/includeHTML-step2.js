!function includeHTML() {
  let allElements, i, element, file;
  axios.get("/api/signup-user-first-name", {
    headers: {
      userId: Cookies.get('userId')
    }
  }).then(res => {
    document.querySelector('.form-title').innerHTML = `Welcome, ${res.data.name}`
  }).catch(err => {
    console.log("err.response:", err.response);
  })

  /* Loop through a collection of all HTML elements: */
  allElements = document.getElementsByTagName("*");

  /* Return an array from the HTMLCollections object */
  allElements = Array.from(allElements);
  allElements.map(element => {
    file = element.getAttribute("w3-include-html");
    if (file) {
      element.removeAttribute("w3-include-html");
      fetch(file)
        .then(response => response.text())
        .then(res => element.innerHTML = res);
    }
  })
}();
