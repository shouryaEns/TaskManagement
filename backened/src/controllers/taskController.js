const Task = require('../models/Task');
const mongoose = require('mongoose');

exports.createTask = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      createdBy: req.user._id, 
      assignee: req.user._id
    };

    const task = await Task.create(payload);
    res.status(201).json(task);
  } catch (err) { next(err); }
};


exports.getTasks = async (req,res,next) => {
  try {
    const { search, status, priority, sortBy, page=1, limit=20 } = req.query;
    const filter = {};
    if(req.user.role !== 'admin') filter.$or = [{ assignee: req.user._id }, { createdBy: req.user._id }];
    if(search) filter.title = { $regex: search, $options: 'i' };
    if(status) filter.status = status;
    if(priority) filter.priority = priority;

    const sort = {};
    if(sortBy === 'priority') sort.priority = -1;
    if(sortBy === 'dueDate') sort.dueDate = 1;

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email')
      .sort(sort)
      .skip((page-1)*limit).limit(Number(limit));

    res.json({ tasks, page: Number(page) });
  } catch(err){ next(err); }
};

exports.updateTask = async (req,res,next) => {
  try {
    const task = await Task.findById(req.params.id);
    if(!task) return res.status(404).json({ msg: 'Not found' });
    if(req.user.role !== 'admin' && ![task.createdBy.toString(), (task.assignee||'').toString()].includes(req.user._id.toString())){
      return res.status(403).json({ msg: 'Not Authorised To Update!' });
    }
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch(err){ next(err); }
};

exports.deleteTask = async (req,res,next) => {
  try {
    const task = await Task.findById(req.params.id);
    if(!task) return res.status(404).json({ msg: 'Not found' });
    if(req.user.role !== 'admin' && task.createdBy.toString() !== req.user._id.toString()){
      return res.status(403).json({ msg: 'Authority Denied' });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Task Deleted' });
  } catch(err){ next(err); }
};

exports.tasksByStatus = async (req,res,next) => {
  try {
    const match = {};
    if(req.user.role !== 'admin') match.$or = [{ assignee: req.user._id }, { createdBy: req.user._id }];
    const agg = await Task.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);
    res.json(agg);
  } catch(err){ next(err); }
};
