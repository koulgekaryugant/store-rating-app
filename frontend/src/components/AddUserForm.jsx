import React, { useState } from 'react'
import api from '../services/api'

const AddUserForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/admin/users', formData)
      setMessage(`Successfully added user: ${res.data.user.name} (${res.data.user.role})`)
      setFormData({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-center text-blue-600">Add New User</h3>
      {message && <p className="p-3 mb-4 bg-green-100 text-green-700 rounded">{message}</p>}
      {error && <p className="p-3 mb-4 bg-red-100 text-red-700 rounded">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="p-3 border rounded w-full" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" required className="p-3 border rounded w-full" />
        <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" type="password" required className="p-3 border rounded w-full" />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" required className="p-3 border rounded w-full" />
        <select name="role" value={formData.role} onChange={handleChange} required className="p-3 border rounded w-full bg-white">
          <option value="NORMAL_USER">Normal User</option>
          <option value="STORE_OWNER">Store Owner</option>
          <option value="SYSTEM_ADMIN">System Admin</option>
        </select>
        <button type="submit" disabled={loading} className="bg-green-600 text-white w-full py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400">
          {loading ? 'Adding User...' : 'Add User'}
        </button>
      </form>
    </div>
  )
}

export default AddUserForm