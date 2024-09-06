// app/components/UserManagement.js
"use client"

import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', hourlyRate: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Failed to add user');
      await fetchUsers();
      setNewUser({ name: '', email: '', hourlyRate: '' });
    } catch (err) {
      setError('Failed to add user');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editingUser),
      });
      if (!response.ok) throw new Error('Failed to update user');
      await fetchUsers();
      setEditingUser(null);
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete user');
      await fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleAddUser} className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Hourly Rate"
          value={newUser.hourlyRate}
          onChange={(e) => setNewUser({...newUser, hourlyRate: e.target.value})}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add User'}
        </button>
      </form>

      {isLoading && <p className="text-center text-gray-500">Loading...</p>}

      <ul className="space-y-4">
        {users.map(user => (
          <li key={user._id} className="bg-gray-100 p-4 rounded-lg shadow">
            {editingUser && editingUser._id === user._id ? (
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={editingUser.hourlyRate}
                  onChange={(e) => setEditingUser({...editingUser, hourlyRate: e.target.value})}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-2">
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">Save</button>
                  <button onClick={() => setEditingUser(null)} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300">Cancel</button>
                </div>
              </form>
            ) : (
              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">Hourly Rate: ${user.hourlyRate}</p>
                <div className="mt-4 space-x-2">
                  <button onClick={() => setEditingUser(user)} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300">Edit</button>
                  <button onClick={() => handleDeleteUser(user._id)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
