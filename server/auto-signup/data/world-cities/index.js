const __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const country_json_1 = __importDefault(require('./countries.json'));
const state_json_1 = __importDefault(require('./unitedStates.json'));
const city_json_1 = __importDefault(require('./cities.json'));
exports.default = {
  getAllCities: () => city_json_1.default,
  getAllCountries: () => country_json_1.default,
};
