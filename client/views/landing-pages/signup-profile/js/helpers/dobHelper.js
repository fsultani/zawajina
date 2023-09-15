const birthDayOptions = ['<option>Select Day</option>'];
[...Array(31)].map((_, i) => birthDayOptions.push(`<option>${i + 1}</option>`));
document.querySelector('#dob-day > .select-wrapper').innerHTML = birthDayOptions;

const today = new Date();
const age18 = today.getFullYear() - 18;

let birthYearOptions = ['<option>Select Year</option>'];
[...Array(100)].map((_, i) => birthYearOptions.push(`<option>${age18 - i}</option>`));
document.querySelector('#dob-year > .select-wrapper').innerHTML = birthYearOptions;
