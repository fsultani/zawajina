let handleNameValidationValue = false;

export const handleNameValidation = name => {
  const invalidCharactersRegex = /[!@#$%^&*()_\+=[\]{}|:;"<,>\?\/\\~`]/;
  const invalidCharacters = string => invalidCharactersRegex.test(string);

  const numbersRegex = /\d/;
  const inputHasAtLeastOneNumber = string => numbersRegex.test(string);

  if (
    !name ||
    inputHasSocialMediaAccount(name) ||
    inputHasSocialMediaTag(name) ||
    inputHasPhoneNumber(name) ||
    invalidCharacters(name) ||
    inputHasAtLeastOneNumber(name) ||
    preventWebLinks(name)
  ) {
    handleNameValidationValue = false;
    getQuerySelectorById('name').classList.remove('animate-border-bottom');
    getQuerySelectorById('name-wrapper').style.cssText = `border-bottom: 2px solid red;`

    let errorMessage = '';
    if (name.length === 0) {
      errorMessage = 'Name cannot be blank';
    } else if (inputHasSocialMediaAccount(name) || inputHasSocialMediaTag(name)) {
      errorMessage = 'No email or social media accounts allowed';
    } else if (inputHasPhoneNumber(name)) {
      errorMessage = 'Phone numbers are not allowed';
    } else if (invalidCharacters(name)) {
      errorMessage = 'Name cannot contain special characters';
    } else if (inputHasAtLeastOneNumber(name)) {
      errorMessage = 'Name cannot contain a number';
    } else if (preventWebLinks(name)) {
      errorMessage = 'Web links are not allowed';
    }

    getQuerySelectorById('name-error').innerHTML = errorMessage;
  } else {
    handleNameValidationValue = true;
    getQuerySelectorById('name-wrapper').classList.remove('form-error-border-bottom');
    getQuerySelectorById('name').classList.add('animate-border-bottom');
    getQuerySelectorById('name-error').innerHTML = '';
  }
};
