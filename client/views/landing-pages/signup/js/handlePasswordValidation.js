export let handlePasswordValidationValue = false;

export const handlePasswordValidation = password => {
  if (password.length < 8) {
    getQuerySelectorById('password').classList.remove('animate-border-bottom');
    getQuerySelectorById('password-wrapper').style.cssText = `border-bottom: 2px solid red;`
    handlePasswordValidationValue = false;
  } else if (password.length >= 8) {
    if (getQuerySelectorById('password-wrapper').classList.contains('form-error-border-bottom')) {
      getQuerySelectorById('password-wrapper').classList.remove('form-error-border-bottom');
      getQuerySelectorById('password').classList.add('animate-border-bottom');
    }
    handlePasswordValidationValue = true;
  }
};
