const hobbiesSearchHelper = () => {
  const hobbiesArray = [];

  document.querySelectorAll('.hobbies-input').forEach(checkbox => {
    if (checkbox.checked) hobbiesArray.push(checkbox.id);
  });

  return hobbiesArray;
};
