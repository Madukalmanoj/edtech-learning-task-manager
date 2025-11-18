const express = require('express');
const rateLimit = require('express-rate-limit');
const { signup, login, listTeachers } = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');
const { signupSchema, loginSchema } = require('../validators/authValidator');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/teachers', listTeachers);
router.post('/signup', validateRequest(signupSchema), signup);
router.post('/login', loginLimiter, validateRequest(loginSchema), login);

module.exports = router;

