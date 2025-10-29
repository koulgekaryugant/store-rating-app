// src/pages/Login/Login.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Input/Input'
import { loginUser } from '../../services/authService'
import Navbar from '../../components/Navbar/Navbar'
import toast, { Toaster } from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await loginUser({ email, password })
      localStorage.setItem('token', res.token)
      localStorage.setItem('role', res.role)
      toast.success('Login successful!')
      setTimeout(() => {
        if (res.role === 'STORE_OWNER') navigate('/owner/dashboard')
        else if (res.role === 'NORMAL_USER') navigate('/user/dashboard')
        else navigate('/admin/dashboard')
      }, 1000)
    } catch (err) {
      let message = 'Login failed'
      if (err.response?.data?.errors) {
        const messages = err.response.data.errors.map(e => Object.values(e)[0])
        message = messages.join(', ')
      } else if (err.response?.data?.message) {
        message = err.response.data.message
      }
      toast.error(message)
    }
  }

  return (
    <>
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-200 to-purple-200">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Login</h2>
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="bg-gray-900 text-white w-full py-3 rounded-xl mt-4 hover:bg-gray-800 transition duration-300 shadow-md font-semibold



">
            Login
          </button>
        </form>
      </div>
    </>
  )
}

export default Login
