const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .select('_id blog.title blog.date blog.author blog.preview blog.sections')
      .lean();
    
    const formattedBlogs = blogs.map(blog => {
      // Generate preview if missing
      let preview = blog.blog.preview;
      if (!preview && blog.blog.sections) {
        const firstSectionKey = Object.keys(blog.blog.sections)[0];
        preview = blog.blog.sections[firstSectionKey].content.substring(0, 150) + '...';
      }
      
      return {
        _id: blog._id,
        title: blog.blog.title,
        date: blog.blog.date,
        author: blog.blog.author,
        preview: preview || "No preview available"
      };
    });
    
    res.json(formattedBlogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});
// GET single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id, {
      "blog.title": 1,
      "blog.date": 1,
      "blog.author": 1,
      "blog.preview": 1,
      "blog.sections": 1,
      "meta": 1,
      _id: 1
    }).lean();
    
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    // Generate preview if missing
    if (!blog.blog.preview && blog.blog.sections) {
      const firstSection = Object.values(blog.blog.sections)[0];
      blog.blog.preview = firstSection.content.substring(0, 150) + '...';
    }

    res.json({
      _id: blog._id,
      ...blog.blog,
      meta: blog.meta
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Create new blog
router.post('/', async (req, res) => {
  try {
    const blogData = {
      blog: {
        title: req.body.title,
        date: req.body.date || new Date().toISOString().split('T')[0],
        author: req.body.author,
        preview: req.body.preview || "Default preview text",
        sections: req.body.sections || {}
      },
      meta: req.body.meta || {}
    };

    const newBlog = new Blog(blogData);
    await newBlog.save();
    res.status(201).json(newBlog.toJSON());
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ errors: messages });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;