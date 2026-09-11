import jwt from 'jsonwebtoken';

const getJwtSecret = () => process.env.JWT_SECRET || 'secret123';

export const verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required.' });
  }

  try {
    req.user = jwt.verify(token, getJwtSecret());
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (!['Admin', 'Super Admin'].includes(req.user?.role)) {
    return res.status(403).json({ message: 'Admin access is required.' });
  }

  return next();
};

export const verifySuperAdmin = (req, res, next) => {
  if (req.user?.role !== 'Super Admin') {
    return res.status(403).json({ message: 'Super Admin access is required.' });
  }

  return next();
};
