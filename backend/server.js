const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: 'https://thunder2700c.github.io' }));  // Your GitHub Pages
app.use(express.json());

// MongoDB Connect (creates DB if new)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected – DB ready/created'))
  .catch(err => console.error('MongoDB connection failed:', err));

// Schemas
const ProgressSchema = new mongoose.Schema({
  chapterId: { type: String, required: true },
  userId: { type: String, required: true },
  progress: { type: Number, default: 0 },
  updated: { type: Date, default: Date.now }
});
ProgressSchema.index({ chapterId: 1, userId: 1 });  // Query perf
const Progress = mongoose.model('Progress', ProgressSchema);

const CommentSchema = new mongoose.Schema({
  chapterId: { type: String, required: true },
  text: { type: String, required: true },
  user: { type: String, required: true },
  date: { type: Date, default: Date.now }
});
CommentSchema.index({ chapterId: 1, date: -1 });  // Sort perf
const Comment = mongoose.model('Comment', CommentSchema);

// Routes: Progress
app.get('/api/progress/:chapterId', async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { userId } = req.query;
    const data = await Progress.findOne({ chapterId, userId });
    res.json(data || { progress: 0 });
  } catch (err) {
    console.error('Progress GET error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/progress/:chapterId', async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { userId, progress } = req.body;
    await Progress.findOneAndUpdate(
      { chapterId, userId },
      { progress, updated: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Progress POST error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Routes: Comments
app.get('/api/comments/:chapterId', async (req, res) => {
  try {
    const { chapterId } = req.params;
    const comments = await Comment.find({ chapterId }).sort({ date: -1 }).limit(50);
    res.json(comments);
  } catch (err) {
    console.error('Comments GET error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/comments/:chapterId', async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { text, user } = req.body;
    const newComment = new Comment({ chapterId, text, user });
    await newComment.save();
    res.json({ success: true });
  } catch (err) {
    console.error('Comments POST error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/', (req, res) => res.send('Gods Rank Awakening Backend – Live!'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test: POST /api/comments/${chapterId} with {text: 'yo', user: 'test'}`);
});
