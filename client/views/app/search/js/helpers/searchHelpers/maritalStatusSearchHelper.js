let maritalStatusesArray = [];

const maritalStatusSearchHelper = () => {
  document.querySelectorAll('.marital-status').forEach(checkbox => {
    const checkboxId = checkbox.id;

    if (maritalStatusesArray.includes(checkboxId)) {
      const index = maritalStatusesArray.indexOf(checkboxId);
      maritalStatusesArray.splice(index, 1);
    }

    if (checkbox.checked) maritalStatusesArray.push(checkbox.id);
  });

  return maritalStatusesArray;
};

const renderCheckedMaritalStatus = () => {
  document.querySelectorAll('.marital-status').forEach(checkbox => {
    if (maritalStatusesArray.includes(checkbox.id)) {
      checkbox.checked = true;
    }
  });
}
