const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if(!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ msg: 'No token' });
  const token = auth.split(' ')[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select('-password');
    next();
  } catch(err){ res.status(401).json({ msg: 'Invalid token' }); }
};

exports.authorize = (roles = []) => {
  if(typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) return res.status(403).json({ msg: 'Admin Permission Denied' });
    next();
  };
};
