import mongoose from 'mongoose';
const likeSchema = new mongoose.Schema({
  content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
  visitorKey: { type: String, required: true }
}, { timestamps: true });
likeSchema.index({ content: 1, visitorKey: 1 }, { unique: true });
export default mongoose.model('Like', likeSchema);
