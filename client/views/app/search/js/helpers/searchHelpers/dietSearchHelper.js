let dietArray = [];

const dietSearchHelper = () => {
  document.querySelectorAll('.diet').forEach(checkbox => {
    const checkboxId = checkbox.id;

    if (dietArray.includes(checkboxId)) {
      const index = dietArray.indexOf(checkboxId);
      dietArray.splice(index, 1);
    }

    if (checkbox.checked) dietArray.push(checkbox.id);
  });

  return dietArray;
};

const renderCheckedDiet = () => {
  document.querySelectorAll('.diet').forEach(checkbox => {
    if (dietArray.includes(checkbox.id)) {
      checkbox.checked = true;
    }
  });
}
