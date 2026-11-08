import express from 'express';
import mongoose from 'mongoose';
import Content from '../models/Content.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';
import auth from '../middleware/auth.js';
const router = express.Router();
const validId = id => mongoose.isValidObjectId(id);
router.get('/', async (req, res, next) => {
  try {
    const { search = '', category = 'All', limit = 100 } = req.query;
    const filter = { status: 'Published', ...(category !== 'All' ? { category } : {}), ...(search ? { $or: [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }] } : {}) };
    const items = await Content.find(filter).sort({ publishedAt: -1, createdAt: -1 }).limit(Math.min(Number(limit) || 100, 100));
    res.json(items);
  } catch (error) { next(error); }
});
router.get('/manage/all', auth, async (req, res, next) => { try { res.json(await Content.find().sort({ updatedAt: -1 })); } catch (error) { next(error); } });
router.post('/', auth, async (req, res, next) => {
  try {
    const { title, description, category, type, thumbnail, mediaUrl, articleBody, status, scheduledAt } = req.body;
    if (!title?.trim() || !description?.trim() || !category?.trim()) return res.status(400).json({ message: 'Title, description and category are required.' });
    const item = await Content.create({ title, description, category, type, thumbnail, mediaUrl, articleBody, status: status || 'Draft', scheduledAt: scheduledAt || null });
    res.status(201).json(item);
  } catch (error) { next(error); }
});
router.get('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid content ID.' });
    const item = await Content.findOne({ _id: req.params.id, status: 'Published' });
    if (!item) return res.status(404).json({ message: 'Content not found.' });
    item.views += 1; await item.save(); res.json(item);
  } catch (error) { next(error); }
});
router.put('/:id', auth, async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid content ID.' });
    const allowed = ['title', 'description', 'category', 'type', 'thumbnail', 'mediaUrl', 'articleBody', 'status', 'scheduledAt'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const item = await Content.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Content not found.' });
    if (item.status === 'Published' && !item.publishedAt) { item.publishedAt = new Date(); await item.save(); }
    res.json(item);
  } catch (error) { next(error); }
});
router.delete('/:id', auth, async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid content ID.' });
    const item = await Content.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ message: 'Content not found.' });
    await Comment.deleteMany({ content: item._id }); await Like.deleteMany({ content: item._id }); res.json({ message: 'Content deleted.' });
  } catch (error) { next(error); }
});
router.post('/:id/like', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid content ID.' });
    const visitorKey = String(req.body.visitorKey || '').slice(0, 100);
    if (!visitorKey) return res.status(400).json({ message: 'A visitor key is required.' });
    const item = await Content.findOne({ _id: req.params.id, status: 'Published' }); if (!item) return res.status(404).json({ message: 'Content not found.' });
    const existing = await Like.findOne({ content: item._id, visitorKey });
    if (existing) { await existing.deleteOne(); item.likes = Math.max(0, item.likes - 1); } else { await Like.create({ content: item._id, visitorKey }); item.likes += 1; }
    await item.save(); res.json({ likes: item.likes, liked: !existing });
  } catch (error) { if (error.code === 11000) return res.status(409).json({ message: 'Already liked.' }); next(error); }
});
export default router;
