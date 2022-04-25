(() => {
  const hijab = document.querySelector('.hijab');
  const hijabValue = hijab.getAttribute('data-hijab');
  if (hijabValue !== 'null') {
    document.getElementById(`hijab-${hijabValue.toLowerCase()}`).checked = true;
  }
})();
