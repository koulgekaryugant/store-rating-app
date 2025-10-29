import React, { useState, useEffect } from 'react'
import api from '../services/api'

const AddStoreForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', ownerId: '' })
  const [storeOwners, setStoreOwners] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchStoreOwners = async () => {
    try {
      const usersRes = await api.get('/admin/users?role=STORE_OWNER')
      const availableOwners = usersRes.data.filter(u => !u.ownedStore)
      setStoreOwners(availableOwners)
    } catch {
      setError('Failed to load store owners.')
    }
  }

  useEffect(() => { fetchStoreOwners() }, [])

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setMessage(''); setError(''); setLoading(true)
    try {
      const res = await api.post('/admin/stores', formData)
      setMessage(`Successfully added store: ${res.data.store.name}`)
      setFormData({ name: '', email: '', address: '', ownerId: '' })
      await fetchStoreOwners()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add store.')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-center text-blue-600">Add New Store</h3>
      {message && <p className="p-3 mb-4 bg-green-100 text-green-700 rounded">{message}</p>}
      {error && <p className="p-3 mb-4 bg-red-100 text-red-700 rounded">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Store Name" required className="p-3 border rounded w-full"/>
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Store Email" type="email" required className="p-3 border rounded w-full"/>
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Store Address" required className="p-3 border rounded w-full"/>
        <select name="ownerId" value={formData.ownerId} onChange={handleChange} required className="p-3 border rounded w-full bg-white">
          <option value="">Select Store Owner</option>
          {storeOwners.map(owner => <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>)}
        </select>
        <button type="submit" disabled={loading} className="bg-green-600 text-white w-full py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400">
          {loading ? 'Adding Store...' : 'Add Store'}
        </button>
      </form>
    </div>
  )
}

export default AddStoreForm
