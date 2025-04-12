const express = require('express');
const router = express.Router();
const Pose = require('../models/Pose');

// Get all poses with optional filtering
router.get('/', async (req, res) => {
  try {
    const { level, search } = req.query;
    const query = {};
    
    if (level) {
      query.level = level;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const poses = await Pose.find(query);
    res.json(poses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single pose by ID
router.get('/:id', async (req, res) => {
  try {
    const pose = await Pose.findById(req.params.id);
    if (!pose) {
      return res.status(404).json({ message: 'Pose not found' });
    }
    res.json(pose);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;