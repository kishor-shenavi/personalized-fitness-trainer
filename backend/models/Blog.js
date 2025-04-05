const mongoose = require('mongoose'); // Add this line at the top

const blogSchema = new mongoose.Schema({
  blog: {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    date: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true
    },
    preview: {
      type: String,
      default: "Default preview text"
    },
    sections: {
      type: Map,
      of: new mongoose.Schema({
        title: String,
        content: String
      }, { _id: true })
    }
  },
  meta: {
    keywords: { type: [String], default: [] }
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);