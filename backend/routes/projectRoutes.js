const express = require('express')
const Project = require('../models/Project')
const auth = require('../middleware/authMiddleware')

const router = express.Router()

/* 🟢 CREATE PROJECT */
router.post('/', auth, async (req, res) => {

  try {

    // ADMIN ONLY
    if (req.user.role !== 'admin') {

      return res.status(403).json({
        message: 'Only admin can create project'
      })
    }

    const project = await Project.create({

      name: req.body.name,

      description: req.body.description,

      createdBy: req.user.id,

      members: req.body.members || []

    })

    res.status(201).json({
      message: 'Project created successfully',
      project
    })

  } catch (error) {

    res.status(500).json({
      message: 'Error creating project',
      error: error.message
    })
  }
})


/* 🟡 GET ALL PROJECTS */
router.get('/', auth, async (req, res) => {

  try {

    const projects = await Project.find()
      .populate('createdBy', 'name email')
      .populate('members', 'name email')

    res.status(200).json(projects)

  } catch (error) {

    res.status(500).json({
      message: 'Error fetching projects',
      error: error.message
    })
  }
})


/* 🔵 UPDATE PROJECT */
router.put('/:id', auth, async (req, res) => {

  try {

    // ADMIN ONLY
    if (req.user.role !== 'admin') {

      return res.status(403).json({
        message: 'Only admin can update project'
      })
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.status(200).json({
      message: 'Project updated successfully',
      project
    })

  } catch (error) {

    res.status(500).json({
      message: 'Error updating project',
      error: error.message
    })
  }
})


/* 🔴 DELETE PROJECT */
router.delete('/:id', auth, async (req, res) => {

  try {

    // ADMIN ONLY
    if (req.user.role !== 'admin') {

      return res.status(403).json({
        message: 'Only admin can delete project'
      })
    }

    await Project.findByIdAndDelete(req.params.id)

    res.status(200).json({
      message: 'Project deleted successfully'
    })

  } catch (error) {

    res.status(500).json({
      message: 'Error deleting project',
      error: error.message
    })
  }
})

module.exports = router