let smokesValue;

const smokesSearchHelper = () => {
  document.querySelectorAll('input[name=smokes]').forEach(radio => {
    if (radio.checked) smokesValue = radio.id;
  });

  return smokesValue;
};

const renderSelectedSmokes = () => {
  document.querySelectorAll('input[name=smokes]').forEach(radio => {
    if (radio.id === smokesValue) radio.checked = true;
  });
}
