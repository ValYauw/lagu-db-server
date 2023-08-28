const bcryptjs = require('bcryptjs');
const SALT = bcryptjs.genSaltSync(10);

function encrypt(password) {
  return bcryptjs.hashSync(password, SALT);
}

function compare(password, hashed) {
  return bcryptjs.compareSync(password, hashed);
}

module.exports = { encrypt, compare };