let wantsChildrenValue;

const wantsChildrenSearchHelper = () => {
  document.querySelectorAll('input[name=wants-children]').forEach(radio => {
    if (radio.checked) wantsChildrenValue = radio.id;
  });

  return wantsChildrenValue;
};

const renderSelectedWantsChildren = () => {
  document.querySelectorAll('input[name=wants-children]').forEach(radio => {
    if (radio.id === wantsChildrenValue) radio.checked = true;
  });
}
