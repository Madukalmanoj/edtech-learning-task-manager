const AppError = require('../utils/AppError');

const validateRequest = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((detail) => detail.message);
    return next(new AppError('Validation failed', 400, details));
  }

  req.body = value;
  return next();
};

module.exports = validateRequest;

