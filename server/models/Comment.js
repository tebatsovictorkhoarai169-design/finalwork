import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({
  content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true },
  displayName: { type: String, required: true, trim: true, maxlength: 50 },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  status: { type: String, enum: ['Pending', 'Approved', 'Hidden'], default: 'Pending' }
}, { timestamps: true });
export default mongoose.model('Comment', commentSchema);
