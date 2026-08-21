const Task = require('../models/Task');

// Get all tasks with pagination, filtering, sorting, and search
const getTasks = async (req, res, next) => {
    try {
        const { status, priority, search, page = 1, limit = 10, sort, order } = req.query;
        let query = { user: req.user.id };

        if (status && status !== 'All') query.status = status;
        if (priority && priority !== 'All') query.priority = priority;
        if (search) query.title = { $regex: search, $options: 'i' };

        let sortStr = '-createdAt';
        if (sort) {
            const sortOrder = order === 'desc' ? '-' : '';
            sortStr = `${sortOrder}${sort}`;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const tasks = await Task.find(query).sort(sortStr).skip(skip).limit(parseInt(limit));
        const total = await Task.countDocuments(query);

        res.status(200).json({
            success: true,
            count: tasks.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: tasks
        });
    } catch (error) { next(error); }
};

// Get single task
const getTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }
        if (task.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }
        res.status(200).json({ success: true, data: task });
    } catch (error) { next(error); }
};

// Create task
const createTask = async (req, res, next) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;
        if (!title) {
            res.status(400);
            throw new Error('Please add a title');
        }
        const task = await Task.create({
            title, description, status, priority, dueDate, user: req.user.id
        });
        res.status(201).json({ success: true, data: task });
    } catch (error) { next(error); }
};

// Update task
const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }
        if (task.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: updatedTask });
    } catch (error) { next(error); }
};

// Delete task
const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }
        if (task.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }
        await task.deleteOne();
        res.status(200).json({ success: true, id: req.params.id });
    } catch (error) { next(error); }
};

// Change status
const changeTaskStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }
        if (task.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }
        task.status = status;
        await task.save();
        res.status(200).json({ success: true, data: task });
    } catch (error) { next(error); }
};

// Get analytics
const getAnalytics = async (req, res, next) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'Done').length;
        const pendingTasks = totalTasks - completedTasks;
        const todoTasks = tasks.filter(t => t.status === 'Todo').length;
        const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
        
        const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
        
        const priorityStats = {
            low: tasks.filter(t => t.priority === 'Low').length,
            medium: tasks.filter(t => t.priority === 'Medium').length,
            high: tasks.filter(t => t.priority === 'High').length
        };

        res.status(200).json({
            success: true,
            totalTasks,
            completedTasks,
            pendingTasks,
            todoTasks,
            inProgressTasks,
            completionPercentage,
            priorityStats
        });
    } catch (error) { next(error); }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, changeTaskStatus, getAnalytics };
