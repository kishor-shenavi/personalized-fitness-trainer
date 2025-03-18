import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">Website Name</div>
        <ul className="flex space-x-6">
          <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
          <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
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
    </div>
  );
}

export default Home;