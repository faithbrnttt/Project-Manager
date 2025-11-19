// controllers/projectController.js (multer-s3 version)
const mongoose = require('mongoose');
const Project = require('../models/Project');

const toTechArray = (val) => {
  if (val == null) return [];
  if (Array.isArray(val)) return val.map(t => t.trim()).filter(Boolean);
  try { const arr = JSON.parse(val); if (Array.isArray(arr)) return arr.map(t => String(t).trim()).filter(Boolean); } catch {}
  return String(val).split(',').map(t => t.trim()).filter(Boolean);
};

// ✅ GET (sorted by saved order)
const getProjects = async (req, res) => {
  try {
    const items = await Project.find({})
      .sort({ order: 1, createdAt: 1 })
      .lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ POST (append new project to end using max(order)+1)
const createProject = async (req, res) => {
  try {
    const f = req.file;
    const image = f ? {
      url: f.location,
      key: f.key,
      bucket: f.bucket,
      etag: (f.etag || '').replaceAll('"', ''),
      mimetype: f.mimetype,
      size: f.size,
    } : undefined;

    const max = await Project.findOne({}, 'order').sort({ order: -1 }).lean();
    const nextOrder = (max?.order ?? -1) + 1;

    const project = await Project.create({
      title: req.body.title,
      description: req.body.description,
      codeUrl: req.body.codeUrl || req.body.repoUrl,
      technologies: toTechArray(req.body.technologies),
      image,
      order: nextOrder,
    });

    res.status(201).json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ✅ PUT :id (update fields/image; order unchanged here)
const updateProject = async (req, res) => {
  try {
    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.codeUrl || req.body.repoUrl) updates.codeUrl = req.body.codeUrl || req.body.repoUrl;
    if (req.body.technologies !== undefined) updates.technologies = toTechArray(req.body.technologies);

    if (req.file?.location) {
      updates.image = {
        url: req.file.location,
        key: req.file.key,
        bucket: req.file.bucket,
        etag: (req.file.etag || '').replaceAll('"', ''),
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ✅ DELETE
const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// ✅ NEW: bulk reorder (save order indexes from DnD)
const reorderProjects = async (req, res) => {
  try {
    const ids = req.body; // ["665...", "666...", ...] in the new order
    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({ message: 'Invalid payload' });
    }
    if (!ids.every(mongoose.isValidObjectId)) {
      return res.status(400).json({ message: 'Invalid id in payload' });
    }

    const ops = ids.map((id, idx) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: idx } } }
    }));
    await Project.bulkWrite(ops, { ordered: false });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to save order' });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
};
