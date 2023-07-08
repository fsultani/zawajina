const locationSearchHelper = () => {
  const locationsArray = [];

  document.querySelectorAll('.user-location-content').forEach(({ id }) => {
    const location = JSON.parse(id);
    locationsArray.push(location);
  });

  return locationsArray;
};
