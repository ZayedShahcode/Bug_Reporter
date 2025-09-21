const jwt = require('jsonwebtoken');

function verifyUser(req, res, next) {
  const authHeader = req.get('authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }


  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Wrong authorization header' });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; 
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { verifyUser };
