const express = require('express');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { createTaskSchema, updateTaskSchema } = require('../validators/taskValidator');

const router = express.Router();

router.use(auth);

router.route('/').get(getTasks).post(validateRequest(createTaskSchema), createTask);

router
  .route('/:id')
  .put(validateRequest(updateTaskSchema), updateTask)
  .delete(deleteTask);

module.exports = router;

