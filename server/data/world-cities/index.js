const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });

const cities = __importDefault(require('./cities.json'));
const countries = __importDefault(require('./countries.json'));
const geoCoordinates = __importDefault(require('./geoCoordinates.json'));
const unitedStates = __importDefault(require('./unitedStates.json'));

exports.default = {
  getAllCities: () => cities.default,
  getAllCountries: () => countries.default,
  getGeoCoordinates: () => geoCoordinates.default,
  getAllUnitedStates: () => unitedStates.default,
};
