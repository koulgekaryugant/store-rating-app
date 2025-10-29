import React, { useState } from 'react';
import Input from './Input/Input'; // Assuming you have an Input component
import api from '../services/api';

const UpdatePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    
    setLoading(true);

    try {
      const res = await api.put('/user/update-password', {
        currentPassword,
        password: newPassword,
      });
      
      setMessage(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.response?.data?.errors) {
        const messages = err.response.data.errors.map((e) => Object.values(e)[0]);
        setError(messages.join(', '));
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Password update failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-2xl font-bold mb-6 text-center text-blue-600">Update Password</h3>
      
      {message && <p className="p-3 mb-4 bg-green-100 text-green-700 rounded border border-green-300">{message}</p>}
      {error && <p className="p-3 mb-4 bg-red-100 text-red-700 rounded border border-red-300">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <Input 
          label="Current Password" 
          type="password" 
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)} 
        />
        <Input 
          label="New Password (8-16 chars, 1 Uppercase, 1 Special)" 
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
        />
        <Input 
          label="Confirm New Password" 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />
        
        <button 
          type="submit" 
          className="bg-gray-900 text-white w-full py-2 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-700 mt-4
"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default UpdatePasswordForm;