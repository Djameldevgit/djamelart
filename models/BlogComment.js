const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'user' }
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const BlogCommentSchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'user' }
  },
  text: { type: String, required: true },
  replies: [ReplySchema], // un nivel de replies
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('BlogComment', BlogCommentSchema);
