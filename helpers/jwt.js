const { sign, verify } = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET_KEY || 'SECRET'

function signToken(payload, expiresIn = null) {
  let options = null;
  if (expiresIn) options = {expiresIn}
  return sign(payload, SECRET, options);
}

function verifyToken(token) {
  return verify(token, SECRET);
}

module.exports = { signToken, verifyToken }