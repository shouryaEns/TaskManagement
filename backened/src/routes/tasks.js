const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { taskValidation,updateTaskValidation } = require('../validations/taskValidation');
const ctrl = require('../controllers/taskController');

const router = express.Router();

router.use(protect);

router.post('/', validate(taskValidation), ctrl.createTask);
router.get('/', ctrl.getTasks);
router.get('/stats/status', ctrl.tasksByStatus);
router.put('/:id', validate(updateTaskValidation), ctrl.updateTask);
router.delete('/:id', authorize('admin'), ctrl.deleteTask);

module.exports = router;
