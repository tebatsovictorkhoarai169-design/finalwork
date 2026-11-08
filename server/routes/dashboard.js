import express from 'express';
import Content from '../models/Content.js';
import Comment from '../models/Comment.js';
import auth from '../middleware/auth.js';
const router = express.Router();
router.get('/stats', auth, async (req, res, next) => {
  try {
    const [total, published, drafts, scheduled, comments, pending, views, likes, popular] = await Promise.all([
      Content.countDocuments(), Content.countDocuments({ status: 'Published' }), Content.countDocuments({ status: 'Draft' }), Content.countDocuments({ status: 'Scheduled' }), Comment.countDocuments(), Comment.countDocuments({ status: 'Pending' }), Content.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]), Content.aggregate([{ $group: { _id: null, total: { $sum: '$likes' } } }]), Content.find({ status: 'Published' }).sort({ views: -1 }).limit(4).select('title views likes category')
    ]);
    res.json({ total, published, drafts, scheduled, comments, pending, views: views[0]?.total || 0, likes: likes[0]?.total || 0, popular });
  } catch (error) { next(error); }
});
export default router;
