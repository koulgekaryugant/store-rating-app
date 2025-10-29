import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import api from '../../services/api'
import AddUserForm from '../../components/AddUserForm'
import AddStoreForm from '../../components/AddStoreForm'

const StarIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}>
    <path d="M12 2.1l2.45 5.01 5.5.75-3.99 3.88 0.94 5.48L12 16.45l-4.9 2.57 0.94-5.48L3.05 7.86l5.5-.75L12 2.1z"/>
  </svg>
)

const initialUserFilters = { name: '', email: '', address: '', role: '' }
const initialStoreFilters = { name: '', email: '', address: '' }

const AdminDashboard = () => {
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [userFilters, setUserFilters] = useState(initialUserFilters)
  const [storeFilters, setStoreFilters] = useState(initialStoreFilters)
  const [activeTab, setActiveTab] = useState('stats')
  const [hamburgerOpen, setHamburgerOpen] = useState(false)

  const fetchUsers = async (filters) => {
    const query = new URLSearchParams(filters).toString()
    try { const res = await api.get(`/admin/users?${query}`); setUsers(res.data) } 
    catch { setUsers([]) }
  }

  const fetchStores = async (filters) => {
    const query = new URLSearchParams(filters).toString()
    try { const res = await api.get(`/admin/stores?${query}`); setStores(res.data) } 
    catch { setStores([]) }
  }

  const handleUserFilterChange = e => setUserFilters({ ...userFilters, [e.target.name]: e.target.value })
  const handleStoreFilterChange = e => setStoreFilters({ ...storeFilters, [e.target.name]: e.target.value })
  const handleUserFilterSubmit = () => fetchUsers(userFilters)
  const handleStoreFilterSubmit = () => fetchStores(storeFilters)
  const handleResetUserFilters = () => { setUserFilters(initialUserFilters); fetchUsers(initialUserFilters) }
  const handleResetStoreFilters = () => { setStoreFilters(initialStoreFilters); fetchStores(initialStoreFilters) }

  useEffect(() => {
    const fetchStats = async () => { try { const res = await api.get('/admin/dashboard'); setStats(res.data) } catch {} }
    fetchStats()
  }, [])

  useEffect(() => {
    if (activeTab === 'users') fetchUsers(userFilters)
    else if (activeTab === 'stores') fetchStores(storeFilters)
  }, [activeTab, userFilters, storeFilters])

  const renderStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
      {['Total Users', 'Total Stores', 'Total Ratings'].map((title, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-2xl transition transform hover:-translate-y-1">
          <p className="text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-2">{idx === 0 ? stats.totalUsers || 0 : idx === 1 ? stats.totalStores || 0 : stats.totalRatings || 0}</p>
        </div>
      ))}
    </div>
  )

  const renderUserFilters = () => (
    <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col sm:flex-row sm:flex-wrap gap-4 items-end">
      <input name="name" value={userFilters.name} onChange={handleUserFilterChange} placeholder="Filter by Name" className="p-2 border rounded w-full sm:w-auto flex-1"/>
      <input name="email" value={userFilters.email} onChange={handleUserFilterChange} placeholder="Filter by Email" className="p-2 border rounded w-full sm:w-auto flex-1"/>
      <input name="address" value={userFilters.address} onChange={handleUserFilterChange} placeholder="Filter by Address" className="p-2 border rounded w-full sm:w-auto flex-1"/>
      <select name="role" value={userFilters.role} onChange={handleUserFilterChange} className="p-2 border rounded w-full sm:w-auto bg-white">
        <option value="">All Roles</option>
        <option value="SYSTEM_ADMIN">Admin</option>
        <option value="STORE_OWNER">Store Owner</option>
        <option value="NORMAL_USER">Normal User</option>
      </select>
      <button onClick={handleUserFilterSubmit} className="bg-blue-600 text-white p-2 rounded w-full sm:w-auto hover:bg-blue-700 transition">Apply Filters</button>
      <button onClick={handleResetUserFilters} className="bg-gray-500 text-white p-2 rounded w-full sm:w-auto hover:bg-gray-600 transition">Reset</button>
    </div>
  )

  const renderStoreFilters = () => (
    <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col sm:flex-row sm:flex-wrap gap-4 items-end">
      <input name="name" value={storeFilters.name} onChange={handleStoreFilterChange} placeholder="Filter by Store Name" className="p-2 border rounded w-full sm:w-auto flex-1"/>
      <input name="email" value={storeFilters.email} onChange={handleStoreFilterChange} placeholder="Filter by Store Email" className="p-2 border rounded w-full sm:w-auto flex-1"/>
      <input name="address" value={storeFilters.address} onChange={handleStoreFilterChange} placeholder="Filter by Store Address" className="p-2 border rounded w-full sm:w-auto flex-1"/>
      <button onClick={handleStoreFilterSubmit} className="bg-blue-600 text-white p-2 rounded w-full sm:w-auto hover:bg-blue-700 transition">Apply Filters</button>
      <button onClick={handleResetStoreFilters} className="bg-gray-500 text-white p-2 rounded w-full sm:w-auto hover:bg-gray-600 transition">Reset</button>
    </div>
  )

  const renderUsers = () => (
    <>
      {renderUserFilters()}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 p-4 sm:p-6">
            <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
            <p className="text-gray-600 mb-1">{user.email}</p>
            <p className="text-gray-600 mb-1 font-bold">Role: {user.role}</p>
            <p className="text-gray-600 mb-1">Address: {user.address}</p>
            {user.role === 'STORE_OWNER' && (
              <div className="flex items-center flex-wrap">
                <p className="mr-2 text-sm">Avg Store Rating:</p>
                {[1,2,3,4,5].map(i => <StarIcon key={i} filled={user.averageStoreRating >= i}/>)}
                <span className='ml-2 text-sm font-semibold'>{user.averageStoreRating || 'N/A'}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )

  const renderStores = () => (
    <>
      {renderStoreFilters()}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        {stores.map(store => (
          <div key={store.id} className="bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
            <div className="bg-blue-600 text-white rounded-t-xl p-4">
              <h3 className="text-xl font-bold">{store.name}</h3>
              <p className="text-sm">{store.address}</p>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-gray-700 mb-1">Email: {store.email}</p>
              <div className="flex items-center mb-1">
                {[1,2,3,4,5].map(i => <StarIcon key={i} filled={store.overallRating >= i}/>)}
                <span className='ml-2 font-semibold'>{store.overallRating || 'N/A'}</span>
              </div>
              <p className="text-gray-700">Total Ratings: {store.totalRatings}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )

  const tabs = [
    { key: 'stats', label: 'Stats' },
    { key: 'users', label: 'Users' },
    { key: 'stores', label: 'Stores' },
    { key: 'addUser', label: 'Add User' },
    { key: 'addStore', label: 'Add Store' }
  ]

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left flex-1">Admin Dashboard</h1>
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
            <button key={tab.key} className={`px-4 py-2 rounded-lg ${activeTab===tab.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 shadow'}`} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && renderStats()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'stores' && renderStores()}
        {activeTab === 'addUser' && <AddUserForm />}
        {activeTab === 'addStore' && <AddStoreForm />}

      </div>
    </>
  )
}

export default AdminDashboard
