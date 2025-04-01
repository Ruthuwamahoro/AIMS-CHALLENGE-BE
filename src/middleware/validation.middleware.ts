const { ApiError } = require('../utils/response.util');

const validateUser = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || username.length < 3) {
    throw new ApiError('Username must be at least 3 characters long', 400);
  }

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new ApiError('Please provide a valid email address', 400);
  }

  if (!password || password.length < 6) {
    throw new ApiError('Password must be at least 6 characters long', 400);
  }

  next();
};

const validateDirectory = (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    throw new ApiError('Directory name is required', 400);
  }

  if (name.includes('/') || name.includes('\\')) {
    throw new ApiError('Directory name cannot contain path separators', 400);
  }

  next();
};

module.exports = {
  validateUser,
  validateDirectory,
};