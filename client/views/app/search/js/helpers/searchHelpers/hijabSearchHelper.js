let hijabValue;

const hijabSearchHelper = () => {
  document.querySelectorAll('input[name=hijab]').forEach(radio => {
    if (radio.checked) hijabValue = radio.id;
  });

  return hijabValue;
};

const renderSelectedHijab = () => {
  document.querySelectorAll('input[name=hijab]').forEach(radio => {
    if (radio.id === hijabValue) radio.checked = true;
  });
}
