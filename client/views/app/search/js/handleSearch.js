const handleSearch = async event => {
  event.preventDefault();

  const locations = locationSearchHelper();
  const languages = languageSearchHelper();
  const profession = professionSearchHelper();
  const hobbies = hobbiesSearchHelper();
  const maritalStatus = maritalStatusSearchHelper();
  const religiousConviction = religiousConvictionsSearchHelper();
  const religiousValues = religiousValuesSearchHelper();
  const education = educationSearchHelper();
  const hasChildren = hasChildrenSearchHelper();
  const wantsChildren = wantsChildrenSearchHelper();
  const hijab = hijabSearchHelper();
  const canRelocate = canRelocateSearchHelper();
  const diet = dietSearchHelper();
  const smokes = smokesSearchHelper();
  const ethnicity = ethnicitySearchHelper();
  const age = ageSearchHelper();
  const height = heightSearchHelper();
  const prayerLevel = prayerLevelSearchHelper();
  const sortResults = getQuerySelectorById('sort-results').value;
  const showPhotosOnly = getQuerySelectorById('photos-only-checkbox').checked;

  const searchOptions = {
    locations,
    languages,
    profession,
    hobbies,
    maritalStatus,
    religiousConviction,
    religiousValues,
    education,
    hasChildren,
    wantsChildren,
    hijab,
    canRelocate,
    diet,
    smokes,
    ethnicity,
    age,
    height,
    prayerLevel,
    sortResults,
    showPhotosOnly,
  };

  try {
    isSubmitting('search-button-loading-spinner-wrapper', true);

    const { data } = await Axios({
      method: 'put',
      apiUrl: '/search/api', // server/routes/search.js
      params: {
        ...searchOptions,
      },
    });

    window.location.pathname = data?.url;
  } catch {
    isSubmitting('search-button-loading-spinner-wrapper', false);
    toast('error', 'There was an error');
  }
};
