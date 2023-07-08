let religiousValuesArray = [];

const religiousValuesSearchHelper = () => {
  document.querySelectorAll('.religious-values').forEach(checkbox => {
    const checkboxId = checkbox.id;

    if (religiousValuesArray.includes(checkboxId)) {
      const index = religiousValuesArray.indexOf(checkboxId);
      religiousValuesArray.splice(index, 1);
    }

    if (checkbox.checked) religiousValuesArray.push(checkbox.id);
  });

  return religiousValuesArray;
};

const renderCheckedReligiousValues = () => {
  document.querySelectorAll('.religious-values').forEach(checkbox => {
    if (religiousValuesArray.includes(checkbox.id)) {
      checkbox.checked = true;
    }
  });
}
