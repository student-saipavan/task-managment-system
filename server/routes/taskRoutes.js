const express = require('express');
const router = express.Router();
const { getTasks, getTask, createTask, updateTask, deleteTask, changeTaskStatus, getAnalytics } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/analytics/summary', getAnalytics);

router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/:id')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask);

router.patch('/:id/status', changeTaskStatus);

module.exports = router;
