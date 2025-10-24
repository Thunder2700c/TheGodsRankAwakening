const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'https://thunder2700c.github.io' })); // Your site
app.use(express.json());

// Mongo Connect (free Atlas: mongodb.com/cloud/atlas – get URI)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB connected – gods awakening!'))
  .catch(err => console.error('DB rift:', err));

// Schemas
const chapterSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
  progress: { type: Map, of: Number } // User: % read
});
const Chapter = mongoose.model('Chapter', chapterSchema);

const commentSchema = new mongoose.Schema({
  chapterId: String,
  text: String,
  user: String,
  date: { type: Date, default: Date.now }
});
const Comment = mongoose.model('Comment', commentSchema);

// Routes
app.get('/api/chapters', async (req, res) => {
  try {
    const chapters = await Chapter.find();
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: 'Portal error' });
  }
});

app.get('/api/chapters/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findOne({ id: req.params.id });
    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: 'Chapter not found' });
  }
});

app.post('/api/progress', async (req, res) => {
  const { chapterId, userId, percent } = req.body;
  try {
    let chapter = await Chapter.findOne({ id: chapterId });
    if (!chapter) chapter = new Chapter({ id: chapterId, title: 'New Ch', content: '' });
    chapter.progress.set(userId, percent);
    await chapter.save();
    res.json({ saved: true });
  } catch (err) {
    res.status(500).json({ error: 'Save failed' });
  }
});

app.post('/api/comments', async (req, res) => {
  const { chapterId, text, user } = req.body;
  try {
    const comment = new Comment({ chapterId, text, user });
    await comment.save();
    res.json({ added: true });
  } catch (err) {
    res.status(500).json({ error: 'Comment rift' });
  }
});

app.get('/api/comments/:chapterId', async (req, res) => {
  try {
    const comments = await Comment.find({ chapterId: req.params.chapterId }).sort({ date: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Comments fetch failed' });
  }
});

// Seed (run once via POST /api/seed)
app.post('/api/seed', async (req, res) => {
  const seedChapters = [
    { id: '1', title: 'Prologue: Defiant Stand', content: 'Your prologue text...' },
    // Add Ch. 2-5 here
  ];
  try {
    for (let ch of seedChapters) {
      await new Chapter(ch).save();
    }
    res.json({ seeded: seedChapters.length });
  } catch (err) {
    res.status(500).json({ error: 'Seed failed' });
  }
});

app.listen(PORT, () => console.log(`Backend on ${PORT} – ranks live!`));
