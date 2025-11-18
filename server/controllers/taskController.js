const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const buildTeacherTaskQuery = async (teacherId) => {
  const students = await User.find({ teacherId }, '_id');
  const studentIds = students.map((student) => student._id);

  return {
    $or: [
      { userId: teacherId }, // tasks teacher authored
      ...(studentIds.length ? [{ userId: { $in: studentIds } }] : []),
    ],
  };
};

const getTasks = asyncHandler(async (req, res) => {
  const { role, userId } = req.user;

  let query;
  if (role === 'student') {
    query = { userId };
  } else {
    query = await buildTeacherTaskQuery(userId);
  }

  const tasks = await Task.find(query)
    .sort({ dueDate: 1 })
    .populate('userId', 'email role teacherId');

  const formatted = tasks.map((task) => {
    const taskObj = task.toObject();
    taskObj.ownership =
      task.userId && task.userId._id.toString() === userId ? 'owner' : 'assigned-student';
    return taskObj;
  });

  res.json({
    success: true,
    message: 'Tasks fetched',
    data: formatted,
  });
});

const createTask = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const payload = {
    ...req.body,
    userId,
  };

  const task = await Task.create(payload);
  await task.populate('userId', 'email role teacherId');

  res.status(201).json({
    success: true,
    message: 'Task created',
    data: task,
  });
});

const ensureTaskOwner = async (taskId, currentUserId) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new AppError('Invalid task id', 400);
  }

  const task = await Task.findById(taskId).populate('userId', 'email role teacherId');
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (task.userId._id.toString() !== currentUserId) {
    throw new AppError('You can only modify tasks you created', 403);
  }

  return task;
};

const updateTask = asyncHandler(async (req, res) => {
  const task = await ensureTaskOwner(req.params.id, req.user.userId);

  Object.assign(task, req.body);
  await task.save();

  res.json({
    success: true,
    message: 'Task updated',
    data: task,
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await ensureTaskOwner(req.params.id, req.user.userId);
  await task.deleteOne();

  res.json({
    success: true,
    message: 'Task deleted',
  });
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};

