const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
      }
    ],
    lastMessage: {
      text: { type: String, default: '' },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);
