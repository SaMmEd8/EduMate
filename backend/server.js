// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const dbURI = 'mongodb://localhost:27017/edumateDB';
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// --- API Routes ---
// This is the "note" that tells the server where to find the user and notes logic.
app.use('/api/users', require('./routes/users'));
app.use('/api/notes', require('./routes/notes'));
// In backend/server.js
app.use('/api/reminders', require('./routes/reminders'));
// In backend/server.js
app.use('/api/ai', require('./routes/ai'));
// In backend/server.js
app.use('/api/stats', require('./routes/stats'));

// --- Start the Server ---
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
