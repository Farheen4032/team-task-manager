const Task = require('../models/Task')

// CREATE TASK
const createTask = async (req, res) => {

  try {

    const {
      title,
      description,
      status,
      assignedTo,
      project,
      dueDate,
      priority
    } = req.body

    const task = await Task.create({

      title,
      description,
      status,
      assignedTo,
      project,
      dueDate,
      priority,

      createdBy: req.user._id
    })

    res.status(201).json(task)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: 'Error creating task'
    })
  }
}

// GET TASKS
const getTasks = async (req, res) => {

  try {

    const tasks = await Task.find()

      .populate('assignedTo', 'name email')
      .populate('project', 'name')

      .sort({ createdAt: -1 })

    res.json(tasks)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: 'Error fetching tasks'
    })
  }
}

// UPDATE TASK
const updateTask = async (req, res) => {

  try {

    const updatedTask = await Task.findByIdAndUpdate(

      req.params.id,

      req.body,

      { new: true }

    )

    res.json(updatedTask)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: 'Error updating task'
    })
  }
}

// DELETE TASK
const deleteTask = async (req, res) => {

  try {

    await Task.findByIdAndDelete(req.params.id)

    res.json({
      message: 'Task deleted successfully'
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: 'Error deleting task'
    })
  }
}

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
}