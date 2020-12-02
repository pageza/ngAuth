const jwt = require('jsonwebtoken')

module.exports = (req, res, next ) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'ThisShouldBeVerySecret');
    req.userData = {email: decodedToken.email, userID: decodedToken.userID};
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Authorization failed'
    })
  }

}
