const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();
console.log("Using Email:", process.env.EMAIL_USER);
console.log("Using Pass:", process.env.EMAIL_PASS ? '✅ Present' : '❌ Missing');

// Configure email transporter (using Gmail)
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465, false for port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  

// Handle contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 1. Send email to admin
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: 'your-business@email.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>New Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // 2. Send confirmation to user
    await transporter.sendMail({
      from: `"Your Fitness Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'We Got Your Message!',
      html: `
        <h2>Thanks for reaching out, ${name}!</h2>
        <p>We've received your message and will respond within 24 hours.</p>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>The Fitness Team</p>
      `,
    });

    res.status(200).json({ 
      success: true,
      message: 'Message sent successfully' 
    });

  } catch (error) {
    console.error('❌ Error sending contact email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message',
      error: error.message 
    });
  }
});

module.exports = router;