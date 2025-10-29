import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import api from '../../services/api'
import { FaStar } from 'react-icons/fa'
import UpdatePasswordForm from '../../components/UpdatePasswordForm'

const UserDashboard = () => {
  const [stores, setStores] = useState([])
  const [ratings, setRatings] = useState({})
  const [activeTab, setActiveTab] = useState('all')
  const [filters, setFilters] = useState({ name: '', email: '', address: '' })
  const [hamburgerOpen, setHamburgerOpen] = useState(false)


  const handleRate = async (storeId, value) => {
    await api.post(`/stores/rate/${storeId}`, { ratingValue: value })
    setRatings(prev => ({ ...prev, [storeId]: value }))
  }

  const fetchStores = async () => {
    const res = await api.get('/stores')
    setStores(res.data)
    const initialRatings = {}
    res.data.forEach(s => (initialRatings[s.id] = s.userSubmittedRating || 0))
    setRatings(initialRatings)
  }

  useEffect(() => {
    if (activeTab !== 'password') fetchStores()
  }, [activeTab])

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(filters.name.toLowerCase()) &&
    store.email.toLowerCase().includes(filters.email.toLowerCase()) &&
    store.address.toLowerCase().includes(filters.address.toLowerCase())
  )

  const renderFilters = () => (
    <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col sm:flex-row sm:flex-wrap gap-4 items-end">
      <input placeholder="Store Name" value={filters.name} onChange={e => setFilters({ ...filters, name: e.target.value })} className="border p-2 rounded w-full sm:w-auto flex-1"/>
      <input placeholder="Email" value={filters.email} onChange={e => setFilters({ ...filters, email: e.target.value })} className="border p-2 rounded w-full sm:w-auto flex-1"/>
      <input placeholder="Address" value={filters.address} onChange={e => setFilters({ ...filters, address: e.target.value })} className="border p-2 rounded w-full sm:w-auto flex-1"/>
      <button onClick={() => setFilters({ name: '', email: '', address: '' })} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition w-full sm:w-auto">Reset</button>
    </div>
  )

  const renderAllStores = () => (
    <>
      {renderFilters()}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map(store => (
          <div key={store.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
            <div className="bg-gray-900 text-gray-100 rounded-t-xl p-4

">
              <h2 className="text-lg sm:text-xl font-bold">{store.name}</h2>
              <p className="text-sm">{store.address}</p>
            </div>
            <div className="p-4 sm:p-6 space-y-2">
              <p className="text-gray-700 text-sm sm:text-base"><span className="font-semibold">Email:</span> {store.email}</p>
              <p className="text-gray-700 text-sm sm:text-base"><span className="font-semibold">Overall Rating:</span> {store.overallRating || 'N/A'}</p>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} onClick={() => handleRate(store.id, v)} className="focus:outline-none">
                    <FaStar className={`h-5 sm:h-6 w-5 sm:w-6 ${ratings[store.id] >= v ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-300 transition`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )

  const renderYourRatings = () => {
    const ratedStores = filteredStores.filter(store => ratings[store.id] > 0)
    if (!ratedStores.length) return <p className="text-center text-gray-600">You haven't rated any stores yet.</p>
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ratedStores.map(store => (
          <div key={store.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-2">{store.name}</h2>
            <p className="text-gray-700 text-sm sm:text-base mb-1"><span className="font-semibold">Your Rating:</span> {ratings[store.id]}</p>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map(v => <FaStar key={v} className={`h-5 sm:h-6 w-5 sm:w-6 ${ratings[store.id] >= v ? 'text-yellow-400' : 'text-gray-300'}`} />)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const tabs = [
    { key: 'all', label: 'All Stores' },
    { key: 'rated', label: 'Your Ratings' },
    { key: 'password', label: 'Update Password' }
  ]

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold flex-1 text-center sm:text-left">User Dashboard</h1>
          <div className="sm:hidden relative">
            <button onClick={() => setHamburgerOpen(!hamburgerOpen)} className="text-gray-700 p-2 border rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {hamburgerOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg flex flex-col z-50">
                {tabs.map(tab => (
                  <button key={tab.key} onClick={() => { setActiveTab(tab.key); setHamburgerOpen(false) }} className={`px-4 py-2 text-left w-full hover:bg-blue-100 transition ${activeTab===tab.key?'bg-blue-600 text-white':''}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden sm:flex flex-wrap justify-center mb-6 sm:mb-8 gap-2">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-lg ${activeTab===tab.key?'bg-blue-600 text-white':'bg-white text-gray-700 shadow'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'all' && renderAllStores()}
        {activeTab === 'rated' && renderYourRatings()}
        {activeTab === 'password' && <UpdatePasswordForm />}

      </div>
    </>
  )
}

export default UserDashboard
