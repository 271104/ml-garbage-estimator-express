require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const apiRoutes = require('./routes/api'); // Import API routes
const geminiConfig = require('./config/gemini'); // Initialize Gemini

const app = express();
const port = process.env.PORT || 5000;

// Initialize Gemini API (this makes 'genAI' and 'model' available)
geminiConfig.init(); // Make sure this initialization happens

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (your frontend HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', apiRoutes); // All routes in api.js will be prefixed with /api

// Fallback for any other route not handled (e.g., refresh on React Router)
// For a simple static HTML file, this might not be strictly needed,
// but good for SPAs.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// Basic error handling middleware (can be expanded)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Frontend accessible at http://localhost:${port}`);
});