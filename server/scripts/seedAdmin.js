import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Content from '../models/Content.js';
const run = async () => {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing.');
  await mongoose.connect(process.env.MONGODB_URI);
  const email = (process.env.ADMIN_EMAIL || 'admin@offset.studio').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';
  const hash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate({ email }, { name: process.env.ADMIN_NAME || 'Studio Editor', email, password: hash }, { upsert: true, new: true, setDefaultsOnInsert: true });
  if (await Content.countDocuments() === 0) {
    await Content.insertMany([
      { title: 'The art of beginning again', description: 'A field note on creative momentum, imperfect first drafts, and making room for better ideas.', category: 'Creative Practice', type: 'Article', thumbnail: 'https://images.unsplash.com/photo-1455390582262-044c39f1b6c9?auto=format&fit=crop&w=1200&q=85', articleBody: 'The first version is not supposed to be the final version. It is supposed to exist.\n\nMake something small, make it honestly, and let the next version teach you what it needs.' , status: 'Published', publishedAt: new Date() },
      { title: 'A quieter kind of productivity', description: 'Why thoughtful systems often outperform busy schedules, and how to build a rhythm that lasts.', category: 'Lifestyle', type: 'Article', thumbnail: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85', articleBody: 'Productivity can be less about doing more and more about protecting attention. Start with one meaningful priority.' , status: 'Published', publishedAt: new Date(Date.now() - 86400000 * 3) },
      { title: 'Designing for the in-between', description: 'A visual exploration of the small moments where technology meets everyday life.', category: 'Design', type: 'Video', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85', mediaUrl: 'https://www.youtube.com/', status: 'Published', publishedAt: new Date(Date.now() - 86400000 * 7) },
      { title: 'Notes from a curious mind', description: 'An audio journal about collecting references, noticing patterns and staying curious.', category: 'Culture', type: 'Podcast', thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=85', mediaUrl: 'https://open.spotify.com/', status: 'Published', publishedAt: new Date(Date.now() - 86400000 * 12) }
    ]);
  }
  console.log(`Creator account ready: ${email}`);
  await mongoose.disconnect();
};
run().catch(error => { console.error(error); process.exit(1); });
