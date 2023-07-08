let educationArray = [];

const educationSearchHelper = () => {
  document.querySelectorAll('.education').forEach(checkbox => {
    const checkboxId = checkbox.id;

    if (educationArray.includes(checkboxId)) {
      const index = educationArray.indexOf(checkboxId);
      educationArray.splice(index, 1);
    }

    if (checkbox.checked) educationArray.push(checkbox.id);
  });

  return educationArray;
};

const renderCheckedEducation = () => {
  document.querySelectorAll('.education').forEach(checkbox => {
    if (educationArray.includes(checkbox.id)) {
      checkbox.checked = true;
    }
  });
}
