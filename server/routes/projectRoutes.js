// routes/projects.js
const router = require('express').Router();
const upload = require('../middleware/upload');
const ctrl = require('../controllers/projectController');

// ✅ JSON body parsing (if not already in app.js)
const express = require('express');
router.use(express.json());

// Order matters:
router.get('/', ctrl.getProjects);
router.post('/', upload.single('image'), ctrl.createProject);

// 👉 put reorder BEFORE :id
router.put('/reorder', ctrl.reorderProjects);

router.put('/:id', upload.single('image'), ctrl.updateProject);
router.delete('/:id', ctrl.deleteProject);

module.exports = router;

