import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { FaStar } from 'react-icons/fa'
import api from '../../services/api'
import UpdatePasswordForm from '../../components/UpdatePasswordForm'

const OwnerDashboard = () => {
  const [store, setStore] = useState(null)
  const [activeTab, setActiveTab] = useState('info')
  const [ratersFilter, setRatersFilter] = useState({ name: '', email: '' })
  const [hamburgerOpen, setHamburgerOpen] = useState(false)


  const fetchStore = async () => {
    try {
      const res = await api.get('/stores/owner/dashboard')
      setStore(res.data)
    } catch {
      setStore(null)
    }
  }

  useEffect(() => {
    if (activeTab !== 'password') fetchStore()
  }, [activeTab])

  const filteredRaters = store?.ratersList.filter(r => 
    r.name.toLowerCase().includes(ratersFilter.name.toLowerCase()) &&
    r.email.toLowerCase().includes(ratersFilter.email.toLowerCase())
  ) || []

  const renderStoreInfo = () => (
    <div className="bg-white p-6 rounded-xl shadow mb-6 hover:shadow-2xl transition transform hover:-translate-y-1">
      <h2 className="font-semibold text-2xl mb-2">{store.storeName}</h2>
      <div className="flex items-center mb-2">
        <p className="mr-2">Average Rating:</p>
        {[1, 2, 3, 4, 5].map(i => (
          <FaStar key={i} className={`h-5 w-5 ${store.averageRating >= i ? 'text-yellow-400' : 'text-gray-300'}`} />
        ))}
      </div>
      <p>Total Ratings: {store.totalRatings}</p>
    </div>
  )

  const renderRatersFilters = () => (
    <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4 items-end">
      <input placeholder="Filter by Name" value={ratersFilter.name} onChange={e => setRatersFilter({ ...ratersFilter, name: e.target.value })} className="border p-2 rounded"/>
      <input placeholder="Filter by Email" value={ratersFilter.email} onChange={e => setRatersFilter({ ...ratersFilter, email: e.target.value })} className="border p-2 rounded"/>
      <button onClick={() => setRatersFilter({ name: '', email: '' })} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition">Reset</button>
    </div>
  )

  const renderRaters = () => (
    <>
      {renderRatersFilters()}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {filteredRaters.map((rater, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2">{rater.name}</h3>
            <p className="text-gray-600 mb-1">{rater.email}</p>
            <div className="flex items-center mb-1">
              <p className="mr-2">Rating:</p>
              {[1, 2, 3, 4, 5].map(j => <FaStar key={j} className={`h-5 w-5 ${rater.rating >= j ? 'text-yellow-400' : 'text-gray-300'}`} />)}
            </div>
            <p className="text-gray-500 text-sm">Rated At: {new Date(rater.ratedAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </>
  )

  const tabs = [
    { key: 'info', label: 'Store Info' },
    { key: 'raters', label: 'Raters' },
    { key: 'password', label: 'Update Password' }
  ]

  return (
    <>
      <Navbar />
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex-1 text-center sm:text-left">Store Owner Dashboard</h1>
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

        {activeTab === 'info' && store && renderStoreInfo()}
        {activeTab === 'raters' && store && renderRaters()}
        {activeTab === 'password' && <UpdatePasswordForm />}

      </div>
    </>
  )
}

export default OwnerDashboard
