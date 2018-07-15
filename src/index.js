function component() {
  var element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = "Hi again!"

  return element;
}

document.body.appendChild(component());
