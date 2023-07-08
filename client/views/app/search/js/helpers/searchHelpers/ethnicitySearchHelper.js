const ethnicitySearchHelper = () => {
  const ethnicitiesArray = [];

  document.querySelectorAll('.user-ethnicity-content').forEach(({ id }) => ethnicitiesArray.push(id));

  return ethnicitiesArray;
};
