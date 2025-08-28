// backend/routes/stats.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');
const Reminder = require('../models/Reminder');

// @route   GET /api/stats
// @desc    Get user productivity stats
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // --- Calculate total counts ---
        const totalNotes = await Note.countDocuments({ user: req.user.id });
        const totalReminders = await Reminder.countDocuments({ user: req.user.id });

        // --- Calculate notes created in the last 7 days ---
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentNotes = await Note.find({
            user: req.user.id,
            date: { $gte: sevenDaysAgo }
        });

        // Process data for the chart (group notes by day)
        const notesByDay = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            notesByDay[key] = 0;
        }

        recentNotes.forEach(note => {
            const key = note.date.toISOString().split('T')[0];
            if (notesByDay[key] !== undefined) {
                notesByDay[key]++;
            }
        });

        // Format for Chart.js
        const chartLabels = Object.keys(notesByDay).reverse();
        const chartData = Object.values(notesByDay).reverse();

        // --- Send all stats back to the frontend ---
        res.json({
            totalNotes,
            totalReminders,
            notesChart: {
                labels: chartLabels,
                data: chartData,
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;