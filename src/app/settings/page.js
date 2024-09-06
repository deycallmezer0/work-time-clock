"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SettingsPage = () => {
  const [hourlyRate, setHourlyRate] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch user data');
      const userData = await response.json();
      setHourlyRate(userData.hourlyRate || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Failed to load user data. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hourlyRate: parseFloat(hourlyRate) }),
      });
      if (!response.ok) throw new Error('Failed to update hourly rate');
      setMessage('Hourly rate updated successfully!');
    } catch (error) {
      console.error('Error updating hourly rate:', error);
      setMessage('Failed to update hourly rate. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Rate ($)
          </label>
          <input
            type="number"
            id="hourlyRate"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
            min="0"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Update Hourly Rate
        </button>
      </form>
      {message && (
        <p className={`mt-4 ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default SettingsPage;
