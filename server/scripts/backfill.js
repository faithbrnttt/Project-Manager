// scripts/backfill-project-order.js
require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const projects = await Project.find({}).sort({ createdAt: 1 }).lean();
  await Promise.all(projects.map((p, i) =>
    Project.updateOne({ _id: p._id }, { $set: { order: i } })
  ));
  console.log('Backfilled', projects.length, 'projects');
  await mongoose.disconnect();
})();
