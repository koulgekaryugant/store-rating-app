import React from 'react'
import { Link, useNavigate } from 'react-router-dom'


const Navbar = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  const handleLogoClick = () => {
    if (!token) navigate('/')
  }

  return (
    <nav className="bg-gray-900 text-gray-100 px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50

">
      <div
        onClick={handleLogoClick}
        className="flex items-center cursor-pointer hover:opacity-80 transition duration-300"
      >
        <span className="font-extrabold text-2xl sm:text-3xl">Verly</span>
       
      </div>
      <div className="flex items-center space-x-3">
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white transition-all duration-300 px-5 py-2 rounded-lg shadow-md hover:shadow-lg font-semibold
"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded hover:bg-blue-500 transition duration-300 font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded hover:bg-blue-500 transition duration-300 font-medium"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
