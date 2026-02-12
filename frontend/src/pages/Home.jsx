import React from "react";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
function Home() {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  };
    
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/';
  };
  const scrollToCategories = () => {
    const aboutSection = document.getElementById('categories-section');
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div>
       <div className="absolute w-custom h-custom -left-245 -top-180 bg-custom-gradient rounded-r-right ">
       </div>

      {/* Navbar */}
     <nav className=" relative z-5 text-white   flex justify-between items-center px-10 py-4 ">
      
     <div className="w-[100px] absolute left-[10px] top-[10px]">
      <img src="/ProjectImages/logo.png"></img>
     </div>

        <ul className="flex space-x-10 ml-[300px] text-xl absolute left-[200px] top-[10px]">
          <li><Link to="/" className="hover:text-black">Home</Link></li>
          <li> <button onClick={scrollToAbout} className="hover:text-black">
              About Us
            </button></li>
          <li><Link to="/contact" className="hover:text-black">Contact Us</Link></li>
          <li><Link to="/blogs" className="hover:text-black">Blogs</Link></li>
          <li>
            {isLoggedIn ? (
              <button onClick={handleLogout} className="hover:text-black">
                Logout
              </button>
            ) : (
              <Link to="/login" className="hover:text-black">Login</Link>
            )}
          </li>
        </ul>
        <button className="bg-white text-black px-4 py-2 rounded shadow-md absolute right-[10px] top-[10px]">AVAILABLE FOR FREE</button>
      </nav>
    
  
      {/* Hero Section */}
      <header className="  relative z-5 p-10  text-white py-16 px-8 flex flex-col md:flex-row items-center justify-center top-[50px]">
        <div className="md:w-1/2 ">
        <div className="text-5xl font-bold text-white">MetaMorphFit :</div>
          <h1 className="text-4xl mt-2 font-bold text-black">Your One-Stop Wellness Shop</h1>
          <p className="mt-12 text-xl">Looking for a Free Personalized Fitness Trainer? It's Now a Reality!</p>
          <p className=" text-lg">Say goodbye to unrealistic goals—our platform tailors workouts and plans just for you.</p>
          <button  onClick={scrollToCategories} className="mt-12 bg-white text-black px-6 py-3 font-semibold rounded-lg h-[60px] ">Start Your Journey Today</button>
        </div>
        <div className=" flex justify-center mt-6 md:mt-0">          
          <img src="/ProjectImages/hero2.jpeg" alt="Gym Training" className="rounded-xl shadow-md h-[390px] w-[300px] absolute top-[70px] right-[305px] "></img>
        </div>
        <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">          
          <img src="/ProjectImages/hero1.jpg" alt="Gym Training" className="rounded-xl shadow-md h-[390px] w-[300px] absolute top-[10px] right-[30px] "></img>
        </div>
      </header>

      {/* What Will We Provide Section */}
      <section className="py-16 px-8 text-align-left mt-[60px]">
        <div className="absolute bg-gradient-to-r from-[#003459] via-[#007EA7] to-[#00A8E8] w-[80px] h-[5px] rounded-xl "></div>
        <div className="text-4xl font-bold text-black flex pt-[18px]">What Will We Provide</div>
        <p className="mt-4 text-black text-lg">We’re here to make personalized fitness accessible to everyone. Whether you’re a beginner, a seasoned athlete, or someone restarting their fitness journey, we’ve got you covered.
        </p>
        <p className="absolute w-[750px] text-gray-700 text-lg">Personalized Plans: We analyze your goals, preferences, and fitness level to create the perfect plan for you.<br/>100% Free: No hidden costs, subscriptions, or barriers—just a commitment to your health.<br/>Expert Guidance: Backed by the latest fitness science, our tools and advice ensure you get real results.<br/>Flexible Workouts: At home, in the gym, or outdoors—customize your workouts for any environment.</p>

        {/* Features */}
        <div className="flex flex-wrap  mt-6 space-x-10"> 
          <div className="absolute right-[470px]">
            <div className=" absolute h-[135px] w-[135px] rounded-full bg-[#007EA7]  ">
            <img src="/ProjectImages/compelety_free.png" alt="Completely Free" className="mx-auto absolute h-[135px] w-[135px] rounded-full" />
            </div>
            <p className="font-semibold pt-[135px]">Completely Free</p>
          </div>
          <div className="absolute right-[250px]">
            <div className=" absolute h-[135px] w-[135px] rounded-full bg-[#007EA7]"  >

            <img src="/ProjectImages/personalized_plan.png" alt="Personalized Plans" className="mx-auto absolute h-[135px] w-[135px] rounded-full" />
            </div>
            <p className="font-semibold pt-[135px]">Personalized Plans</p>
          </div>
          <div className="absolute right-[50px] ">
            <div className=" absolute h-[135px] w-[135px] rounded-full bg-[#007EA7]">
              
            <img src="/ProjectImages/flexible_workout.png" alt="Flexible Workouts" className="mx-auto absolute h-[135px] w-[135px] rounded-full" />
            </div>
            <p className="font-semibold  pt-[135px]">Flexible Workouts</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories-section" className="py-16 px-8 text-center bg-white mt-[110px]">
      <div className="absolute bg-gradient-to-r from-[#003459] via-[#007EA7] to-[#00A8E8] w-[80px] h-[5px] rounded-xl "></div>
        <div className="text-4xl font-bold text-black flex pt-[18px]">Categories to which we provide our service</div>
        
        <div className="flex flex-wrap justify-center mt-8 space-x-6 ">
          <Link to="/fitness" className="bg-[#007EA7] p-4 rounded-xl shadow-md flex flex-wrap justify-center absolute w-[300px] h-[300px] left-[70px]">
            <img src="/ProjectImages/fitness.jpg" alt="Fitness" className="rounded-md" />
            <p className="font-semibold mt-2 text-white text-2xl ">Fitness</p>
            <p className="text-sm"> It refers to a person's overall physical health and ability to perform daily activities efficiently</p>
          </Link>
          <Link to="/nutrition" className="bg-[#007EA7] p-4 rounded-xl shadow-md absolute  left-[640px]  w-[300px] h-[300px]">
            <img src="/ProjectImages/nutrition.jpg" alt="Nutrition" className="rounded-md" />
            <p className="font-semibold mt-2 text-white text-2xl">Nutrition</p>
            <p className="text-sm "> It is the process of consuming and utilizing food for growth, energy, and overall health</p>
          </Link>
          <Link to="/flexibility" className="bg-[#007EA7] p-4 rounded-xl shadow-md absolute w-[300px] h-[300px] right-[70px]">
            <img src="/ProjectImages/flexibility.jpg" alt="Flexibility" className="rounded-md" />
            <p className="font-semibold mt-2 text-white text-2xl">Flexibility</p>
            <p className="text-sm">It is the ability of your muscles and joints to move through their full range of motion without pain or stiffness</p>
          </Link>
        </div>
      </section>

      {/* About us */}
      <section id="about-section" className=" py-16 px-8 bg-white">
        <div className="mt-[250px]">
        <div className="absolute bg-gradient-to-r from-[#003459] via-[#007EA7] to-[#00A8E8] w-[60px] h-[5px] rounded-xl "></div>
        <div className="text-4xl font-bold text-black flex pt-[18px]">About Us</div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {/* <h3 className="text-2xl font-semibold mb-4 mt-4 text-[#007EA7]">Our Story</h3> */}
              <p className="text-black mb-6 mt-[10px]">
                Founded in 2025, MetaMorphFit began with a simple mission: to make personalized fitness accessible to everyone. 
                Our team of certified trainers and nutritionists came together to break down barriers in the fitness industry.
              </p>
              
              <h3 className="text-4xl font-semibold mb-4">Our Approach</h3>
              <p className="text-gray-700">
              We don’t believe in one-size-fits-all plans. Our approach is deeply personalized, focusing on your unique goals, challenges, and lifestyle. Whether you're just starting your fitness journey or looking to level up, we tailor each session, meal plan, and stretch to help you progress safely and sustainably. Our coaching combines evidence-based methods with real-world flexibility to keep you motivated and moving forward.
              </p>

              <h3 className="text-4xl font-semibold mb-2 mt-4">Our Pillars of Wellness
              </h3>
              <p className="text-gray-700 mb-6">
                <h3 className="text-black text-2xl text-semibold ">Nutrition
                </h3>
                Fuel your body, fuel your results. Our nutritional guidance is simple, practical, and tailored to your needs — whether you’re aiming for weight loss, muscle gain, or simply healthier habits. We create easy-to-follow meal strategies that work for your routine, not against it.
              </p>

              <p className="text-gray-700 mb-6">
                <h3 className="text-black text-2xl text-semibold">Flexibility </h3>
                Mobility and recovery are just as important as strength. We incorporate dynamic and static stretching techniques to enhance your range of motion, reduce injury risk, and keep your body feeling its best.

              </p>

              <p className="text-gray-700 mb-6">
                <h3 className="text-black text-2xl text-semibold">Fitness </h3>
                From strength training to cardio conditioning, we design workouts that challenge and empower you — no matter your level. Every program is crafted with intention, helping you build stamina, strength, and confidence with each session.
              </p>
              <h3 className="text-4xl font-semibold mb-2 mt-4">Our Goal
              </h3>
              <p className="text-gray-600 ">Our mission is simple: to help you become the strongest, healthiest version of yourself — inside and out. Through guided training, smart nutrition, and a supportive community, we’re here to help you create lasting lifestyle changes, not just temporary results.

Let’s build a better you — one rep, one bite, one stretch at a time.</p>
            </div>
            
            <div className=" flex justify-center ">
              <img 
                src="/ProjectImages/team.jpg" 
                alt="Our Team" 
                className="rounded-lg "
              />
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold mb-8">Meet The Team</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ">
              {[
                { name: "Kishor Shenavi", role: "", img: "/ProjectImages/a.png" },
                { name: "Shradha Raina", role: "", img: "/ProjectImages/sf2.png" },
                { name: "Siddhant Thakar", role: "", img: "/ProjectImages/sm3.png" },
                { name: "Adeeb Shaikh", role: "", img: "/ProjectImages/a2.png" }
              ].map((member, index) => (
                <div key={index} className="bg-gray-300 p-4 rounded-lg">
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
           <footer className="bg-gradient-to-r from-[#00A8E8] via-[#007EA7] to-[#003459] text-white py-12 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">MetaMorphFit</h3>
            <p className="text-white">
              Your personalized fitness companion helping you achieve your health goals.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white hover:text-black transition">Home</Link></li>
              <li><button onClick={scrollToAbout} className="text-white hover:text-black transition">About Us</button></li>
              <li><Link to="/contact" className="text-white hover:text-black transition">Contact</Link></li>
              <li><Link to="/blogs" className="text-white hover:text-black transition">Blogs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="text-white space-y-2">
              <li>Personal Training</li>
              <li>Nutrition Plans</li>
              <li>Yoga & Flexibility</li>
              <li>Workout Programs</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-white hover:text-gray-400 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://twitter.com" className="text-white hover:text-gray-400 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://instagram.com" className="text-white hover:text-gray-400 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="mt-4">
              <p className="text-white">Subscribe to our newsletter</p>
              <div className="flex mt-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-3 py-2 bg-gray-500 text-white rounded-l focus:outline-none focus:ring-2 focus:ring-[#007EA7]"
                />
                <button className="bg-[#007EA7] px-4 py-2 rounded-r hover:bg-gray-300 transition text-black">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-white">
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