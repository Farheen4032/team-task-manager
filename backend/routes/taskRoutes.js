const express = require('express')
const Task = require('../models/Task')
const auth = require('../middleware/authMiddleware')

const router = express.Router()

/* 🟢 CREATE TASK */
router.post('/', auth, async (req, res) => {

  try {

    // ✅ ADMIN ONLY CAN CREATE TASK
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Only admin can create tasks'
      })
    }

    const task = await Task.create({

      title: req.body.title,

      description: req.body.description || '',

      project: req.body.project,

      assignedTo: req.body.assignedTo,

      dueDate: req.body.dueDate,

      priority: req.body.priority || 'Medium',

      status: 'pending',

      completed: false

    })

    res.status(201).json({
      message: 'Task created successfully',
      task
    })

  } catch (error) {

    res.status(500).json({
      message: 'Error creating task',
      error: error.message
    })
  }
})


/* 🟡 GET ALL TASKS */
router.get('/', auth, async (req, res) => {

  try {

    let tasks

    // ✅ ADMIN SEE ALL TASKS
    if (req.user.role === 'admin') {

      tasks = await Task.find()
        .populate('assignedTo', 'name email')
        .populate('project', 'name description')

    } else {

      // ✅ MEMBER SEE ONLY ASSIGNED TASKS
      tasks = await Task.find({
        assignedTo: req.user.id
      })
        .populate('assignedTo', 'name email')
        .populate('project', 'name description')
    }

    res.status(200).json(tasks)

  } catch (error) {

    res.status(500).json({
      message: 'Error fetching tasks',
      error: error.message
    })
  }
})


/* 🔵 UPDATE TASK */
router.put('/:id', auth, async (req, res) => {

  try {

    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      })
    }

    // ✅ MEMBER CAN ONLY COMPLETE TASK ONCE
    if (
      req.user.role !== 'admin' &&
      task.status === 'completed'
    ) {
      return res.status(403).json({
        message: 'Completed task cannot be changed'
      })
    }

    // ✅ MEMBER ONLY UPDATE STATUS
    if (req.user.role !== 'admin') {

      task.status = req.body.status || task.status

      if (req.body.status === 'completed') {
        task.completed = true
      }

      await task.save()

      return res.status(200).json({
        message: 'Task status updated',
        task
      })
    }

    // ✅ ADMIN CAN UPDATE EVERYTHING
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask
    })

  } catch (error) {

    res.status(500).json({
      message: 'Error updating task',
      error: error.message
    })
  }
})


/* 🔴 DELETE TASK */
router.delete('/:id', auth, async (req, res) => {

  try {

    // ✅ ADMIN ONLY DELETE
    if (req.user.role !== 'admin') {

      return res.status(403).json({
        message: 'Only admin can delete tasks'
      })
    }

    await Task.findByIdAndDelete(req.params.id)

    res.status(200).json({
      message: 'Task deleted successfully'
    })

  } catch (error) {

    res.status(500).json({
      message: 'Error deleting task',
      error: error.message
    })
  }
})

module.exports = router