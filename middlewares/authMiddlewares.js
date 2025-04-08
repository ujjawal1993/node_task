const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token missing or invalid format' });
  }

  // Remove "Bearer " from the header value
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user info set
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};
