let religiousConvictionsArray = [];

const religiousConvictionsSearchHelper = () => {
  document.querySelectorAll('.religious-convictions').forEach(checkbox => {
    const checkboxId = checkbox.id;

    if (religiousConvictionsArray.includes(checkboxId)) {
      const index = religiousConvictionsArray.indexOf(checkboxId);
      religiousConvictionsArray.splice(index, 1);
    }

    if (checkbox.checked) religiousConvictionsArray.push(checkbox.id);
  });

  return religiousConvictionsArray;
};

const renderCheckedReligiousConviction = () => {
  document.querySelectorAll('.religious-convictions').forEach(checkbox => {
    if (religiousConvictionsArray.includes(checkbox.id)) {
      checkbox.checked = true;
    }
  });
}
