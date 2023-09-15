let handleEmailValidationValue = false;

export const handleEmailValidation = email => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!emailRegex.test(email)) {
    handleEmailValidationValue = false;
    getQuerySelectorById('email').classList.remove('animate-border-bottom');
    getQuerySelectorById('email-wrapper').style.cssText = `border-bottom: 2px solid red;`
    getQuerySelectorById('email-error').innerHTML = 'Invalid email';
  } else if (emailRegex.test(email)) {
    if (getQuerySelectorById('email-wrapper').classList.contains('form-error-border-bottom')) {
      getQuerySelectorById('email-wrapper').classList.remove('form-error-border-bottom');
      getQuerySelectorById('email').classList.add('animate-border-bottom');
      getQuerySelectorById('email-error').innerHTML = '';
    }
    handleEmailValidationValue = true;
  }
};
