import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">Website Name</div>
        <ul className="flex space-x-6">
          <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
          <li> <button onClick={scrollToAbout} className="hover:text-blue-600">
              About Us
            </button></li>
          <li><Link to="/contact" className="hover:text-blue-600">Contact Us</Link></li>
          <li><Link to="/blogs" className="hover:text-blue-600">Blogs</Link></li>
          <li><Link to="/login" className="hover:text-blue-600">Login</Link></li>
        </ul>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">AVAILABLE FOR FREE</button>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16 px-8 flex flex-col md:flex-row items-center justify-center">
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold">Your One-Stop Wellness Shop</h1>
          <p className="mt-4 text-lg">Looking for a Free Personalized Fitness Trainer? It's Now a Reality!</p>
          <p className="mt-2 text-sm">Say goodbye to unrealistic goals—our platform tailors workouts and plans just for you.</p>
          <button className="mt-6 bg-white text-blue-600 px-6 py-3 font-semibold rounded">Start Your Journey Today</button>
        </div>
        <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
          <img src="https://source.unsplash.com/500x400/?gym,fitness" alt="Gym Training" className="rounded-lg shadow-md" />
        </div>
      </header>

      {/* What Will We Provide Section */}
      <section className="py-16 px-8 text-center">
        <h2 className="text-3xl font-bold text-blue-600">What Will We Provide</h2>
        <p className="mt-4 text-gray-600">
          We’re here to make personalized fitness accessible to everyone. Whether you’re a beginner, a seasoned athlete, or someone restarting their fitness journey, we’ve got you covered.
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center mt-8 space-x-6">
          <div className="text-center">
            <img src="https://source.unsplash.com/100x100/?money,savings" alt="Completely Free" className="mx-auto" />
            <p className="font-semibold">Completely Free</p>
          </div>
          <div className="text-center">
            <img src="https://source.unsplash.com/100x100/?plans,strategy" alt="Personalized Plans" className="mx-auto" />
            <p className="font-semibold">Personalized Plans</p>
          </div>
          <div className="text-center">
            <img src="https://source.unsplash.com/100x100/?workout,flexibility" alt="Flexible Workouts" className="mx-auto" />
            <p className="font-semibold">Flexible Workouts</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-8 text-center bg-gray-100">
        <h2 className="text-3xl font-bold text-blue-600">Categories to which we provide our service</h2>
        
        <div className="flex flex-wrap justify-center mt-8 space-x-6">
          <Link to="/fitness" className="bg-white p-4 rounded-lg shadow-md">
            <img src="https://source.unsplash.com/300x200/?fitness,exercise" alt="Fitness" className="rounded-md" />
            <p className="font-semibold mt-2">Fitness</p>
          </Link>
          <Link to="/nutrition" className="bg-white p-4 rounded-lg shadow-md">
            <img src="https://source.unsplash.com/300x200/?nutrition,healthy" alt="Nutrition" className="rounded-md" />
            <p className="font-semibold mt-2">Nutrition</p>
          </Link>
          <Link to="/flexibility" className="bg-white p-4 rounded-lg shadow-md">
            <img src="https://source.unsplash.com/300x200/?yoga,stretching" alt="Flexibility" className="rounded-md" />
            <p className="font-semibold mt-2">Flexibility</p>
          </Link>
        </div>
      </section>
      <section id="about-section" className="py-16 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-12">About Us</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Our Story</h3>
              <p className="text-gray-700 mb-6">
                Founded in 2023, Meta MorphFit began with a simple mission: to make personalized fitness accessible to everyone. 
                Our team of certified trainers and nutritionists came together to break down barriers in the fitness industry.
              </p>
              
              <h3 className="text-2xl font-semibold mb-4">Our Approach</h3>
              <p className="text-gray-700">
                We believe fitness shouldn't be one-size-fits-all. Our platform uses smart algorithms combined with human expertise 
                to create plans that adapt to your lifestyle, goals, and preferences.
              </p>
            </div>
            
            <div className="flex justify-center">
              <img 
                src="https://source.unsplash.com/500x350/?team,workout" 
                alt="Our Team" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold mb-6">Meet The Team</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { name: "Alex Johnson", role: "Head Trainer", img: "https://source.unsplash.com/150x150/?trainer" },
                { name: "Sarah Miller", role: "Nutritionist", img: "https://source.unsplash.com/150x150/?nutritionist" },
                { name: "David Chen", role: "Yoga Expert", img: "https://source.unsplash.com/150x150/?yoga" },
                { name: "Maria Garcia", role: "Customer Success", img: "https://source.unsplash.com/150x150/?customer" }
              ].map((member, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <img src={member.img} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-3" />
                  <h4 className="font-semibold">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
           {/* Footer */}
           <footer className="bg-gray-800 text-white py-12 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Meta MorphFit</h3>
            <p className="text-gray-400">
              Your personalized fitness companion helping you achieve your health goals.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><button onClick={scrollToAbout} className="text-gray-400 hover:text-white transition">About Us</button></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              <li><Link to="/blogs" className="text-gray-400 hover:text-white transition">Blogs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="text-gray-400 space-y-2">
              <li>Personal Training</li>
              <li>Nutrition Plans</li>
              <li>Yoga & Flexibility</li>
              <li>Workout Programs</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="mt-4">
              <p className="text-gray-400">Subscribe to our newsletter</p>
              <div className="flex mt-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-3 py-2 bg-gray-700 text-white rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 px-4 py-2 rounded-r hover:bg-blue-700 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Meta MorphFit. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition">Cookie Policy</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;