const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/authentication');


const router = new express.Router();

// Create tasks for logged in user.
router.post('/tasks', auth, async (req, res) => {
    const task = new Task ({
        ...req.body,
        owner: req.user._id
    });

    // Using Async-Await syntax.
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});


// Get tasks owned by user. Get all, get only completed, or get only not completed.
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};
    
    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');

        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    // Using Async-Await syntax.
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.tasks);
    } catch (e) {
        res.status(500).send();
    }
});

// Get single task by owner and task ID.
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    // Using Async-Await syntax.
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        if (e.description === 'CastError') {
            return res.status(400).send('Invalid id');
        }
        res.status(500).send();
    }
});

// Update task.
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Delete task by ID.
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
 });


 module.exports = router;