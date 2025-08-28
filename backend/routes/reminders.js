// backend/routes/reminders.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Reminder = require('../models/Reminder');

// GET all reminders for a user
router.get('/', auth, async (req, res) => {
    try {
        const reminders = await Reminder.find({ user: req.user.id }).sort({ dueDate: 1 });
        res.json(reminders);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST a new reminder
router.post('/', auth, async (req, res) => {
    const { title, dueDate } = req.body;
    try {
        const newReminder = new Reminder({ title, dueDate, user: req.user.id });
        const reminder = await newReminder.save();
        res.json(reminder);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// DELETE a reminder
router.delete('/:id', auth, async (req, res) => {
    try {
        await Reminder.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Reminder removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
