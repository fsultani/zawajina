const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const countries = __importDefault(require('./countries.json'));
const cities = __importDefault(require('./cities.json'));
const geoCoordinates = __importDefault(require('./geoCoordinates.json'));
exports.default = {
  getAllCities: () => cities.default,
  getAllCountries: () => countries.default,
  // getAllCities: () => cities.default.filter(location => location.country === 'United States'),
  // getAllCountries: () => countries.default.filter(location => location.country === 'United States'),
  getGeoCoordinates: () => geoCoordinates.default,
};
