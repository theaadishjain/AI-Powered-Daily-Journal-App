require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();

// CORS setup for production
const allowedOrigins = [
  'https://daynotee.onrender.com/', // TODO: Replace with your actual frontend URL
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// MongoDB Model
const journalSchema = new mongoose.Schema({
  entry: String,
  summary: String,
  mood: String,
  createdAt: { type: Date, default: Date.now }
});
const Journal = mongoose.model('Journal', journalSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Gemini API helper
async function analyzeEntry(entry) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-002:generateContent?key=' + apiKey;  
      const prompt = `Summarize this journal entry in 1-2 sentences and detect the user's mood (e.g., Happy, Sad, Anxious, Motivated). Respond in JSON: { "summary": "...", "mood": "..." }\n\nEntry: ${entry}`;
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    });
    const text = response.data.candidates[0].content.parts[0].text;
    // Try to parse JSON from Gemini's response
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    } else {
      return { summary: 'No summary', mood: 'Unknown' };
    }
  } catch (err) {
    console.error('Gemini API error:', err);
    return { summary: 'Error generating summary', mood: 'Error' };
  }
}

// POST /api/journal - Add new entry
app.post('/api/journal', async (req, res) => {
  try {
    const { entry } = req.body;
    if (!entry) return res.status(400).json({ error: 'Entry is required' });
    const analysis = await analyzeEntry(entry);
    const journal = new Journal({
      entry,
      summary: analysis.summary,
      mood: analysis.mood
    });
    await journal.save();
    res.status(201).json(journal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save entry' });
  }
});

// GET /api/journal - Get all entries (sorted by date desc)
app.get('/api/journal', async (req, res) => {
  try {
    const entries = await Journal.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 