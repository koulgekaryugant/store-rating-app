import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import { FaStar, FaStore, FaUser, FaCheckCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'

const features = [
  { icon: <FaStar size={32} className="text-yellow-400" />, title: 'Rate Stores', description: 'Give 1-5 star ratings to your favorite stores and share your experience.' },
  { icon: <FaStore size={32} className="text-blue-500" />, title: 'Manage Stores', description: 'Admins and owners can easily manage store information and reviews.' },
  { icon: <FaUser size={32} className="text-purple-500" />, title: 'User Friendly', description: 'Simple, clean, and responsive interface for seamless navigation.' },
  { icon: <FaCheckCircle size={32} className="text-green-500" />, title: 'Secure Login', description: 'Role-based login system ensures secure access to dashboards.' },
]

const steps = [
  { step: 1, title: 'Sign Up', description: 'Create your account as a user or store owner in just a few clicks.' },
  { step: 2, title: 'Explore Stores', description: 'Browse stores in your area and see ratings and reviews.' },
  { step: 3, title: 'Rate & Review', description: 'Submit ratings and feedback to help others discover the best stores.' },
  { step: 4, title: 'Manage Dashboard', description: 'Owners and admins can manage store listings and reviews easily.' },
]

const testimonials = [
  { name: 'John Doe', feedback: 'This app helped me find the best local stores quickly!' },
  { name: 'Jane Smith', feedback: 'As a store owner, managing my store and reviews is now super easy.' },
  { name: 'Mike Johnson', feedback: 'Clean interface and easy navigation. Highly recommended!' },
]

const LandingPage = () => {
  const navigate = useNavigate()
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white">
        <div className="min-h-screen flex flex-col justify-center items-center px-6 py-16 text-center">
          <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-5xl md:text-6xl font-extrabold mb-6 flex items-center justify-center space-x-2">
            <span>Welcome to Rating App</span>
            <FaStar className="text-yellow-400 h-10 w-10 md:h-12 md:w-12" />
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
           Explore the best local shops, rate your favorites, and showcase your own store — all in one place.
          </motion.p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/login')} className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-gray-800 transition-transform transform hover:scale-105

">
              Login
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/signup')} className="bg-gray-900 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-gray-800 transition-transform transform hover:scale-105
">
              Sign Up
            </motion.button>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
            <button onClick={() => scrollTo('features')} className="underline hover:text-gray-400">Explore Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="underline hover:text-gray-400">How It Works</button>
          </div>
        </div>
      </div>

      <section id="features" className="py-16 bg-gray-100 text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
          {features.map((feature, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-xl shadow-lg text-center flex flex-col items-center space-y-4 transition duration-300">
              {feature.icon}
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="py-16 bg-white text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          {steps.map((step) => (
            <motion.div key={step.step} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 + step.step * 0.2 }} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {step.step}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="testimonials" className="py-16 bg-gray-100 text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12">What Users Say</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {testimonials.map((t, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-xl shadow-lg text-center">
              <p className="mb-4 text-gray-700">"{t.feedback}"</p>
              <h4 className="font-semibold">{t.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-100 px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50
">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="flex items-center font-bold text-lg cursor-pointer px-4 " onClick={() => navigate('/')}>
            Verly
          </p>
          
                                       
          <div className="flex space-x-4">
            <button onClick={() => scrollTo('features')} className="hover:underline">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="hover:underline">How It Works</button>
            <button onClick={() => scrollTo('testimonials')} className="hover:underline">Testimonials</button>
          </div>
          <p>&copy; {new Date().getFullYear()} Verly. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default LandingPage
