import printMe from './button.js'

const component = () => {
  const element = document.createElement('div');
  const btn = document.createElement('button');
  btn.innerHTML = 'Click me please!';
  btn.onclick = printMe;
  element.appendChild(btn);
  return element;
}

let element = component()
document.body.appendChild(element)

if (module.hot) {
  module.hot.accept('./button.js', function() {
    document.body.removeChild(element);
    element = component();
    document.body.appendChild(element);
  });
}

// function component() {
//   var element = document.createElement('div');

//   element.innerHTML = "Hi again!"

//   return element;
// }

// document.body.appendChild(component());
