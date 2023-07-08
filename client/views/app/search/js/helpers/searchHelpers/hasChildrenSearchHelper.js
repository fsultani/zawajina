let hasChildrenValue;

const hasChildrenSearchHelper = () => {
  document.querySelectorAll('input[name=has-children]').forEach(radio => {
    if (radio.checked) hasChildrenValue = radio.id;
  });

  return hasChildrenValue;
};

const renderSelectedHasChildren = () => {
  document.querySelectorAll('input[name=has-children]').forEach(radio => {
    if (radio.id === hasChildrenValue) radio.checked = true;
  });
}
