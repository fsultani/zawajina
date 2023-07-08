const register = require('./register/index');
const likes = require('./likes');
const authSessionLogin = require('./auth/login');
const authSessionLogout = require('./auth/logout');
const password = require('./password/index');
const passwordApi = require('./password/api');
const profile = require('./user/profile');
const users = require('./users');
const user = require('./user/index');
const userApi = require('./user/api');
const search = require('./search');
const messages = require('./messages');
const settings = require('./settings/index');
const {
  settingsAccountApi,
  settingsPasswordApi,
} = require('./settings/api/index');

module.exports = {
  register,
  likes,
  authSessionLogin,
  authSessionLogout,
  password,
  passwordApi,
  profile,
  users,
  user,
  userApi,
  search,
  messages,
  settings,
  settingsAccountApi,
  settingsPasswordApi,
};
