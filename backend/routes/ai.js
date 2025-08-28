// backend/routes/ai.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
require('dotenv').config(); // Load environment variables
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// @route   POST /api/ai/summarize
// @desc    Summarize a piece of text
// @access  Private
router.post('/summarize', auth, async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'Text is required' });
    }

    try {
        const prompt = `Summarize the following text for a college student in clear, concise points: "${text}"`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        res.json({ summary });
    } catch (error) {
        console.error('Error with Google AI:', error);
        res.status(500).json({ message: 'Failed to generate summary from AI.' });
    }
});

module.exports = router;