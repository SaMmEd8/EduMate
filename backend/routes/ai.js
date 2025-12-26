// backend/routes/ai.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
require('dotenv').config(); // Load environment variables
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash"});

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

// ... your existing router.post('/summarize', ...) code is up here ...

// START: TEMPORARY DEBUGGING ROUTE
router.get('/list-models', async (req, res) => {
    try {
        // Re-initialize the client to be safe
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log("Fetching available models...");

        // This is the function that asks Google AI for a list of models
        const models = await genAI.listModels();

        let modelList = [];
        for await (const m of models) {
            // We are interested in models that support the "generateContent" method
            if (m.supportedGenerationMethods.includes("generateContent")) {
               modelList.push(m.name);
            }
        }

        console.log("Available generative models:", modelList);
        res.json({ availableModels: modelList });

    } catch (error) {
        console.error("LIST MODELS ERROR:", error);
        res.status(500).json({ message: "Failed to list models.", error: error.message });
    }
});
// END: TEMPORARY DEBUGGING ROUTE

module.exports = router; // This should be the last line

module.exports = router;
