import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import axios from 'axios';

const Contact = () => {
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // const handleBackToHome = () => {
  //   navigate('/');
  // };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Error:', err.response ? err.response.data : err.message);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col  min-h-screen bg-[#DEF4FC]">
      <div className="bg-gradient-to-r from-[#00A8E8] via-[#007EA7] to-[#003459] absolute h-[625px] w-[1300px]  top-[90px] left-[0px] rounded-r-[300px]">
      </div>
      <div className=" mx-auto px-4 py-12 max-w-4xl ">
      <nav className=" text-black  flex justify-between items-center bg-gradient-to-r from-[#00A8E8] via-[#007EA7] to-[#003459] ">
       {/* Logo */}
       <div className="text-2xl font-bold  absolute top-[10px] left-[0px] ">
       <div className="w-[100px] ">
      <img src="/ProjectImages/logo.png"></img>
     </div>
       </div>
            
            {/* Navigation Links */}
            <ul className="flex space-x-[75px] ml-[150px] text-xl  absolute top-[10px] right-[550px]">
              <li><Link to="/" className="hover:text-[#007EA7]">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#007EA7]">About Us</Link></li>
              <li><Link to="/blogs" className="hover:text-[#007EA7]">Blogs</Link></li>
            </ul>
            </nav>
      {/* Home Navigation Button */}
      {/* <button
        onClick={handleBackToHome}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
        aria-label="Back to home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </button> */}
      
      <h1 className="text-3xl font-bold text-center mb-8 mt-14 relative z-5">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-3">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-black mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-black mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-black mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 py-2 border rounded-lg"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-[#00A8E8] via-[#007EA7] to-[#003459] text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {submitStatus === 'success' && (
              <p className="mt-4 text-green-600 text-center">
                Message sent successfully! We'll contact you soon.
              </p>
            )}

            {submitStatus === 'error' && (
              <p className="mt-4 text-red-600 text-center">
                Failed to send message. Please try again later.
              </p>
            )}
          </form>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <MapPinIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-gray-600">MetaMorphFit, main road, trimurti chauk</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <PhoneIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-gray-600">+91 98338877655</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <EnvelopeIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-gray-600">MetaMorphFit@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-medium mb-2">Business Hours</h3>
            <p className="text-gray-600">Monday - Friday: 9AM - 6PM</p>
            <p className="text-gray-600">Saturday: 10AM - 4PM</p>
            <p className="text-gray-600">Sunday: Closed</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

// Icons
function MapPinIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function PhoneIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function EnvelopeIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

export default Contact;