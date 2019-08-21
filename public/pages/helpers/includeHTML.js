!function includeNavbar() {
  let z, i, element, navbar;
  
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    element = z[i];
    /*search for elements with a certain atrribute:*/
    navbar = element.hasAttribute('include-navbar');

    if (navbar) {
      element.removeAttribute('include-navbar');
      fetch('/static/components/Nav/index.html')
        .then(res => res.text())
        .then(data => {
          element.innerHTML = data;
        })
      return includeNavbar();
    }
  }
}();

!function includeFooter() {
  let z, i, element, footer;
  
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    element = z[i];
    /*search for elements with a certain atrribute:*/
    footer = element.hasAttribute('site-footer');

    if (footer) {
      element.removeAttribute('site-footer');
      fetch('/static/components/Footer/index.html')
        .then(res => res.text())
        .then(data => {
          element.innerHTML = data;
        })
      return includeFooter();
    }
  }
}();
