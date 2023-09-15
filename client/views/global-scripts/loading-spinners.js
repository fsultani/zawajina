const displayFullPageLoadingSpinner = isLoading => {
  const fullPageLoadingSpinner = getQuerySelector('.full-page-loading-spinner');

  const signupContent = getQuerySelector('.signup-content');
  if (signupContent) signupContent.style.cursor = isLoading ? 'not-allowed' : 'auto';

  document.querySelectorAll('form *').forEach(item => {
    item.style.cssText += `
      opacity: ${isLoading ? 0.85 : 1};
      disabled: ${isLoading};
      pointer-events: ${isLoading ? 'none' : 'auto'};
    `;
  });

  Object.assign(fullPageLoadingSpinner.style, {
    position: 'absolute',
    display: isLoading ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  })

  fullPageLoadingSpinner.innerHTML += `
    <div class='loader-child'></div>
    <div class='loader-child'></div>
    <div class='loader-child'></div>
    <div class='loader-child'></div>
  `;

  document.querySelectorAll('.loader-child').forEach((element, index) => {
    Object.assign(element.style, {
      boxSizing: 'border-box',
      display: isLoading ? 'block' : 'none',
      position: 'absolute',
      width: '64px',
      height: '64px',
      margin: '8px',
      border: '8px solid #fff',
      borderRadius: '50%',
      animation:
        'animation-360-loading-spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
      borderColor: '#00c6a7 transparent transparent transparent',
      opacity: '1',
      zIndex: '999',
      animationDelay: index === 0 ? '-0.45s' : index === 1 ? '-0.3s' : index === 2 ? '-0.15s' : '',
    })
  })
}

const displaySmallLoadingSpinner = (isLoading, parentElement, childElement) => {
  const parentElementSelector = getQuerySelector(parentElement);
  const childElementSelector = getQuerySelector(childElement);
  const smallLoadingSpinner = getQuerySelector('.small-loading-spinner');

  const parentDiv = document.createElement("div");
  if (!smallLoadingSpinner && isLoading) {
    parentDiv.classList.add('small-loading-spinner');
    childElementSelector.parentNode.insertBefore(parentDiv, childElementSelector);
  } else {
    smallLoadingSpinner.remove();
  }

  Object.assign(parentDiv.style, {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '50%',
  })

  parentDiv.innerHTML += `
    <div class='small-loader-child'></div>
    <div class='small-loader-child'></div>
    <div class='small-loader-child'></div>
    <div class='small-loader-child'></div>
  `;

  document.querySelectorAll('.small-loader-child').forEach((element, index) => {
    Object.assign(element.style, {
      boxSizing: 'border-box',
      display: isLoading ? 'block' : 'none',
      position: 'absolute',
      width: '64px',
      height: '64px',
      margin: '8px',
      border: '8px solid #fff',
      borderRadius: '50%',
      animation:
        'animation-360-loading-spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
      borderColor: '#00c6a7 transparent transparent transparent',
      opacity: '1',
      zIndex: '999',
      animationDelay: index === 0 ? '-0.45s' : index === 1 ? '-0.3s' : index === 2 ? '-0.15s' : '',
    })
  })

  document.querySelectorAll('form *').forEach(item => item.disabled = isLoading);
  parentElementSelector.style.opacity = isLoading ? 0.9 : 1.0;
}

let buttonText;
const isSubmitting = (buttonId, value) => {
  const loader = document.getElementById(buttonId);
  Object.assign(loader.style, {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  })

  loader.innerHTML += `
    <div class='isSubmitting-loader-child'></div>
    <div class='isSubmitting-loader-child'></div>
    <div class='isSubmitting-loader-child'></div>
    <div class='isSubmitting-loader-child'></div>
  `;

  document.querySelectorAll('.isSubmitting-loader-child').forEach((element, index) => {
    Object.assign(element.style, {
      boxSizing: 'border-box',
      display: value ? 'block' : 'none',
      position: 'absolute',
      width: '30px',
      height: '30px',
      margin: '8px',
      border: '3px solid #fff',
      borderRadius: '50%',
      animation:
        'animation-360-loading-spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
      borderColor: '#fff transparent transparent transparent',
      opacity: '1',
      zIndex: '999',
      animationDelay: index === 0 ? '-0.45s' : index === 1 ? '-0.3s' : index === 2 ? '-0.15s' : '',
    })
  })

  const formSubmitButton = loader.children[0];
  if (!buttonText) buttonText = formSubmitButton.innerHTML;

  formSubmitButton.innerHTML = value ? '' : buttonText;
  formSubmitButton.disabled = value;
  formSubmitButton.style.cursor = value ? 'not-allowed' : 'pointer';

  document.querySelectorAll('form *').forEach(item => item.disabled = value);
}
