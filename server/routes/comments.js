import express from 'express';
import mongoose from 'mongoose';
import Comment from '../models/Comment.js';
import Content from '../models/Content.js';
import auth from '../middleware/auth.js';
const router = express.Router();
router.post('/', async (req, res, next) => {
  try {
    const { contentId, displayName, message } = req.body;
    if (!mongoose.isValidObjectId(contentId) || !displayName?.trim() || !message?.trim()) return res.status(400).json({ message: 'A name and comment are required.' });
    if (displayName.length > 50 || message.length > 1000) return res.status(400).json({ message: 'Your name or comment is too long.' });
    const item = await Content.findOne({ _id: contentId, status: 'Published' }); if (!item) return res.status(404).json({ message: 'Content not found.' });
    const comment = await Comment.create({ content: contentId, displayName, message });
    res.status(201).json({ message: 'Thanks! Your comment is awaiting approval.', comment });
  } catch (error) { next(error); }
});
router.get('/:contentId', async (req, res, next) => {
  try { if (!mongoose.isValidObjectId(req.params.contentId)) return res.status(400).json({ message: 'Invalid content ID.' }); res.json(await Comment.find({ content: req.params.contentId, status: 'Approved' }).sort({ createdAt: -1 })); }
  catch (error) { next(error); }
});
router.get('/manage/all', auth, async (req, res, next) => { try { res.json(await Comment.find().populate('content', 'title').sort({ createdAt: -1 })); } catch (error) { next(error); } });
router.patch('/:id/status', auth, async (req, res, next) => {
  try { if (!['Pending', 'Approved', 'Hidden'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid comment status.' }); const comment = await Comment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('content', 'title'); if (!comment) return res.status(404).json({ message: 'Comment not found.' }); res.json(comment); }
  catch (error) { next(error); }
});
router.delete('/:id', auth, async (req, res, next) => { try { const comment = await Comment.findByIdAndDelete(req.params.id); if (!comment) return res.status(404).json({ message: 'Comment not found.' }); res.json({ message: 'Comment deleted.' }); } catch (error) { next(error); } });
export default router;
