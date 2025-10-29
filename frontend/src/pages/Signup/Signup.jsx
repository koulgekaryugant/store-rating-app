import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Input/Input'
import { registerUser } from '../../services/authService'
import Navbar from '../../components/Navbar/Navbar'
import toast, { Toaster } from 'react-hot-toast'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('NORMAL_USER')
  const [storeName, setStoreName] = useState('')
  const [errors, setErrors] = useState([])
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    const newErrors = []

    if (name.length < 3) newErrors.push('Name must be at least 3 characters long')
    if (password.length < 8) newErrors.push('Password must be at least 8 characters long')
    if (!/[A-Z]/.test(password)) newErrors.push('Password must contain at least one uppercase letter')
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) newErrors.push('Password must contain at least one special character')

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    const formattedRole = role.toUpperCase().replace(' ', '_')
    const payload = { name, email, address, password, role: formattedRole }
    if (formattedRole === 'STORE_OWNER') payload.storeName = storeName

    try {
      const res = await registerUser(payload)
      localStorage.setItem('token', res.token)
      localStorage.setItem('role', res.role)
      toast.success('Signup successful!')
      setTimeout(() => {
        if (res.role === 'STORE_OWNER') navigate('/owner/dashboard')
        else navigate('/user/dashboard')
      }, 1000)
    } catch (err) {
      let message = 'Signup failed'
      if (err.response?.data?.errors) message = err.response.data.errors.join(', ')
      else if (err.response?.data?.message) message = err.response.data.message
      toast.error(message)
    }
  }

  return (
    <>
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-200 to-purple-200">
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-3xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Sign Up</h2>
          {errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.map((err, idx) => (
                <p key={idx}>{err}</p>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <Input label="Address" value={address} onChange={e => setAddress(e.target.value)} />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <label className="mt-4 mb-1 font-semibold">Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          >
            <option value="NORMAL_USER">Normal User</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
          {role === 'STORE_OWNER' && (
            <div className="mt-4">
              <Input label="Store Name" value={storeName} onChange={e => setStoreName(e.target.value)} />
            </div>
          )}
          <button type="submit" className="bg-gray-900 text-white w-full py-3 rounded-xl mt-4 hover:bg-gray-800 transition duration-300 shadow-md font-semibold
">
            Sign Up
          </button>
        </form>
      </div>
    </>
  )
}

export default Signup
