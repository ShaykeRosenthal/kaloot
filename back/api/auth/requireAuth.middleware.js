// const logger = require('../services/logger.service')

async function requireAuth(req, res, next) {
  console.log("req.sesion is: ", req.session)
  if (!req.session) { //|| !req.session.user
    res.status(401).end('Unauthorized!');
    return;
  }
  next();
}

async function requireAdmin(req, res, next) {
  const user = req.session.user;
  if (!user.isAdmin) {
    res.status(403).end('Unauthorized Enough..');
    return;
  }
  next();
}

// async function requireSpecificUser(req,res,next) {
//   const user = req.session.user;

// }




module.exports = {
  requireAuth,
  requireAdmin
}
