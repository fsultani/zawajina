let canRelocateValue;

const canRelocateSearchHelper = () => {
  document.querySelectorAll('input[name=can-relocate]').forEach(radio => {
    if (radio.checked) canRelocateValue = radio.id;
  });

  return canRelocateValue;
};

const renderSelectedCanRelocate = () => {
  document.querySelectorAll('input[name=can-relocate]').forEach(radio => {
    if (radio.id === canRelocateValue) radio.checked = true;
  });
}
