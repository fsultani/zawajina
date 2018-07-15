function component() {
  var element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = "Watch this page change automagically!"

  return element;
}

document.body.appendChild(component());
