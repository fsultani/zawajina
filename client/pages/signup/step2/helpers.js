export const birthDay = () => {
  const dayOptions = ["<option selected disabled>Day</option>"]
  const res = [...Array(31)].map((_, i) => dayOptions.push(`<option>${i + 1}</option>`))
  document.getElementById('dob-day').innerHTML = dayOptions;
};

export const birthYear = () => {
  const today = new Date();
  const age18 = today.getFullYear() - 18;

  let yearOptions = ["<option selected disabled>Year</option>"]
  const res = [...Array(61)].map((_, i) => yearOptions.push(`<option>${age18 - i}</option>`));
  document.getElementById('dob-year').innerHTML = yearOptions;
};

export const countriesList = () => {
  let countriesList = ["<option selected disabled>Country</option>"]
  axios.get('/register/api/all-countries')
  .then(countries => {
    countries.data.map(country => countriesList.push(`<option>${country.name}</option>`))
    document.getElementById('countries-list').innerHTML = countriesList;
  })
}
