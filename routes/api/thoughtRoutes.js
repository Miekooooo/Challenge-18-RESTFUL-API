const express = require('express');
const router = express.Router();
const Thought = require('../models/Thought'); // Assuming the Thought model is defined in a separate file
const User = require('../models/User'); // Assuming the User model is defined in a separate file

// GET all thoughts
router.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single thought by its _id
router.get('/thoughts/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(thought);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST to create a new thought
router.post('/thoughts', async (req, res) => {
  try {
    const newThought = new Thought(req.body);
    const savedThought = await newThought.save();

    // Push the created thought's _id to the associated user's thoughts array field
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.thoughts.push(savedThought._id);
    await user.save();

    res.status(201).json(savedThought);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT to update a thought by its _id
router.put('/thoughts/:id', async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json(updatedThought);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE to remove a thought by its _id
router.delete('/thoughts/:id', async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndRemove(req.params.id);
    if (!deletedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    // Remove the thought's _id from the associated user's thoughts array field
    const user = await User.findById(deletedThought.userId);
    if (user) {
      user.thoughts.pull(deletedThought._id);
      await user.save();
    }

    res.json(deletedThought);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
