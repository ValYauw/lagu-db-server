const { verifyToken } = require('../helpers/jwt');
const User = require('../models');

async function authentication(req, res, next) {
  try {
    const { access_token } = req.headers;
    if (!access_token) throw { name: 'Unauthorized' };
    const decoded = verifyToken(access_token);
    const { id, username } = decoded;
    if (!id || !username) throw { name: 'Unauthorized' };
    const user = await User.findOne({where: {id, username}});
    if (!user) throw { name: 'Unauthorized' };
    req.user = user;
    next();
  } catch(err) {
    next(err);
  }
}

module.exports = authentication;