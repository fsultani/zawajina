let prayerLevelsArray = [];

const prayerLevelSearchHelper = () => {
  document.querySelectorAll('.prayer-level').forEach(checkbox => {
    const checkboxId = checkbox.id;

    if (prayerLevelsArray.includes(checkboxId)) {
      const index = prayerLevelsArray.indexOf(checkboxId);
      prayerLevelsArray.splice(index, 1);
    }

    if (checkbox.checked) prayerLevelsArray.push(checkbox.id);
  });

  return prayerLevelsArray;
};

const renderCheckedPrayerLevel = () => {
  document.querySelectorAll('.prayer-level').forEach(checkbox => {
    if (prayerLevelsArray.includes(checkbox.id)) {
      checkbox.checked = true;
    }
  });
}
