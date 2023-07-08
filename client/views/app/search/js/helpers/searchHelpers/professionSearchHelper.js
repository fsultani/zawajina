const professionSearchHelper = () => {
  const professionsArray = [];

  document.querySelectorAll('.profession-input').forEach(checkbox => {
    if (checkbox.checked) professionsArray.push(checkbox.id);
  });

  return professionsArray;
};
