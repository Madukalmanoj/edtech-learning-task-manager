const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  const response = {
    success: false,
    message,
  };

  if (err.details) {
    response.details = err.details;
  }

  if (!err.isOperational) {
    console.error('Unexpected error:', err);
  }

  res.status(statusCode).json(response);
};

const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};

