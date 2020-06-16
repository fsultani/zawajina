const jwt = require('jsonwebtoken');
const JWT_SECRET = Buffer.from('fe1a1915a379f3be5394b64d14794932', 'hex')

const authenticateToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization === null) return res.sendStatus(401);
  jwt.verify(authorization, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user.userDetails;
    next();
  })
}

module.exports = authenticateToken;
