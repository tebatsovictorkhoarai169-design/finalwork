import mongoose from 'mongoose';
const contentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, required: true, maxlength: 3000 },
  category: { type: String, required: true, trim: true },
  type: { type: String, enum: ['Article', 'Video', 'Podcast', 'Image'], default: 'Article' },
  thumbnail: { type: String, default: '' },
  mediaUrl: { type: String, default: '' },
  articleBody: { type: String, default: '' },
  status: { type: String, enum: ['Draft', 'Published', 'Scheduled'], default: 'Draft' },
  scheduledAt: { type: Date, default: null },
  publishedAt: { type: Date, default: null },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 }
}, { timestamps: true });
contentSchema.pre('save', function(next) {
  if (!this.slug) this.slug = this.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).slice(2, 7);
  if (this.status === 'Published' && !this.publishedAt) this.publishedAt = new Date();
  next();
});
export default mongoose.model('Content', contentSchema);
