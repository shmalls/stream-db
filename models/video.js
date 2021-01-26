const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  author: String,
  length: String,
  URL: String,
  thumbnailUrl: String,
  authorUrl: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
