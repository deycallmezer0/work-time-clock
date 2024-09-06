// app/components/UserManagement.js
"use client"

import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', hourlyRate: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
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
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
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
      fetchUsers();
      setNewUser({ name: '', email: '', hourlyRate: '' });
    } catch (err) {
      setError('Failed to add user');
      console.error(err);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
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
      fetchUsers();
      setEditingUser(null);
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleAddUser} className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
          className="mr-2 px-2 py-1 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          className="mr-2 px-2 py-1 border rounded"
        />
        <input
          type="number"
          placeholder="Hourly Rate"
          value={newUser.hourlyRate}
          onChange={(e) => setNewUser({...newUser, hourlyRate: e.target.value})}
          className="mr-2 px-2 py-1 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add User</button>
      </form>

      <ul className="space-y-4">
        {users.map(user => (
          <li key={user._id} className="bg-gray-100 p-4 rounded">
            {editingUser && editingUser._id === user._id ? (
              <form onSubmit={handleUpdateUser} className="space-y-2">
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-2 py-1 border rounded"
                />
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-2 py-1 border rounded"
                />
                <input
                  type="number"
                  value={editingUser.hourlyRate}
                  onChange={(e) => setEditingUser({...editingUser, hourlyRate: e.target.value})}
                  className="w-full px-2 py-1 border rounded"
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
                <button onClick={() => setEditingUser(null)} className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
              </form>
            ) : (
              <>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Hourly Rate:</strong> ${user.hourlyRate}</p>
                <button onClick={() => setEditingUser(user)} className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
                <button onClick={() => handleDeleteUser(user._id)} className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;