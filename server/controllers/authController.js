const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const SALT_ROUNDS = 12;

const signup = asyncHandler(async (req, res, next) => {
  const { email, password, role, teacherId } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already registered', 409));
  }

  if (role === 'student') {
    if (!teacherId) {
      return next(new AppError('Students must provide a teacherId', 400));
    }

    if (!mongoose.Types.ObjectId.isValid(teacherId)) {
      return next(new AppError('Invalid teacherId format', 400));
    }

    const teacher = await User.findOne({ _id: teacherId, role: 'teacher' });
    if (!teacher) {
      return next(new AppError('Teacher not found', 404));
    }
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    email,
    passwordHash,
    role,
    teacherId: role === 'student' ? teacherId : undefined,
  });

  return res.status(201).json({
    success: true,
    message: 'Account created',
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      teacherId: user.teacherId || null,
    },
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return next(new AppError('Invalid credentials', 401));
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      teacherId: user.teacherId || null,
    },
  });
});

const listTeachers = asyncHandler(async (req, res) => {
  const teachers = await User.find({ role: 'teacher' }).select('email role');

  res.json({
    success: true,
    message: 'Teachers fetched',
    teachers: teachers.map((teacher) => ({
      id: teacher._id,
      email: teacher.email,
      role: teacher.role,
    })),
  });
});

module.exports = {
  signup,
  login,
  listTeachers,
};

