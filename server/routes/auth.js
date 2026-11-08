import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
const router = express.Router();
router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Incorrect email or password.' });
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) { next(error); }
});
router.get('/me', auth, async (req, res, next) => {
  try { const user = await User.findById(req.user.id).select('-password'); if (!user) return res.status(404).json({ message: 'Creator not found.' }); res.json(user); }
  catch (error) { next(error); }
});
export default router;
