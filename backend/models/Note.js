const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Note', NoteSchema); 