async function authorizeAdmin(req, res, next) {
  try {
    const { role } = req.user;
    if (role !== 'Admin') throw { name: 'Forbidden' };
    next();
  } catch(err) {
    next(err);
  }
}

async function authorizeStaff(req, res, next) {
  try {
    const { role } = req.user;
    if (role !== 'Admin' && role !== 'Staff') throw { name: 'Forbidden' };
    next();
  } catch(err) {
    next(err);
  }
}

module.exports = { authorizeAdmin, authorizeStaff };