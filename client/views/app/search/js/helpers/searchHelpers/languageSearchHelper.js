const languageSearchHelper = () => {
  const languagesArray = [];

  document.querySelectorAll('.user-language-content').forEach(({ id }) => languagesArray.push(id));

  return languagesArray;
};
