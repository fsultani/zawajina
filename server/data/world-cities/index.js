const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const countries = __importDefault(require('./countries.json'));
const unitedStates = __importDefault(require('./unitedStates.json'));
const cities = __importDefault(require('./cities.json'));
exports.default = {
  getAllCities: () => cities.default,
  getAllUnitedStates: () => unitedStates.default,
  getAllCountries: () => countries.default,
};
