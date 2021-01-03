const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };

Object.defineProperty(exports, '__esModule', { value: true });
const country_json_1 = __importDefault(require('./countries.json'));
const state_json_1 = __importDefault(require('./unitedStates.json'));
const city_json_1 = __importDefault(require('./cities.json'));

const compare = (a, b) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

exports.default = {
  getStatesOfUSA: countryId => state_json.default,
  getCitiesOfState: name => {
    if (name.state) {
      const cities = city_json.default.filter((value, index) => value.state === name.state);
      return cities.sort(compare);
    } else {
      const cities = city_json.default.filter(
        (value, index) => value.country_code === name.countryId
      );
      return cities.sort(compare);
    }
  },
  getAllCities: () => city_json.default,
  // getAllCities: () => city_json.default.filter(value => value.country === 'United States'),
  getAllCountries: () => country_json.default,
};
