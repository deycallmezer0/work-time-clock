// app/dashboard/page.js
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PaycheckCalculator from '../components/PaycheckCalculator';
import ReportGenerator from '../components/ReportGenerator';
import Search from '../components/Search';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [timeEntries, setTimeEntries] = useState([]);
  const [lastClockEvent, setLastClockEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('timeTracking');
  const router = useRouter();
  const [editingEntry, setEditingEntry] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentShiftDuration, setCurrentShiftDuration] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [clockInTime, setClockInTime] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    clockIn: '',
    clockOut: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchUserData(token);
      fetchTimeEntries(token);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isWorking && clockInTime) {
      timer = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now - new Date(clockInTime)) / 1000);
        setCurrentShiftDuration(duration);
      }, 1000);
    } else {
      setCurrentShiftDuration(0);
    }
    return () => clearInterval(timer);
  }, [isWorking, clockInTime]);

  useEffect(() => {
    calculateWeeklyHours();
  }, [timeEntries]);


  const fetchUserData = async (token) => {
    try {
      const res = await fetch('/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/login');
    }
  };

  const fetchTimeEntries = async (token) => {
    try {
      const res = await fetch('/api/timeentry', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const entries = await res.json();
        setTimeEntries(entries);
        const latestEntry = entries[0];
        const isCurrentlyWorking = latestEntry && !latestEntry.clockOut;
        setIsWorking(isCurrentlyWorking);
        setLastClockEvent(latestEntry ? (latestEntry.clockOut || latestEntry.clockIn) : null);
        if (isCurrentlyWorking) {
          setClockInTime(latestEntry.clockIn);
        } else {
          setClockInTime(null);
        }
      } else {
        throw new Error('Failed to fetch time entries');
      }
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  };

  const handleClockInOut = async () => {
    const token = localStorage.getItem('token');
    const action = isWorking ? 'clockOut' : 'clockIn';
    try {
      const res = await fetch('/api/timeentry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsWorking(!isWorking);
        setLastClockEvent(new Date());
        if (action === 'clockIn') {
          setClockInTime(data.entry.clockIn);
        } else {
          setClockInTime(null);
        }
        fetchTimeEntries(token);
      } else {
        throw new Error(`Failed to ${action}`);
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const handleEditEntry = (entry) => {
    setEditingEntry({ ...entry });
    setShowEditModal(true);
  };

  const handleUpdateEntry = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/timeentry/${editingEntry._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clockIn: editingEntry.clockIn,
          clockOut: editingEntry.clockOut,
        }),
      });
      if (res.ok) {
        setShowEditModal(false);
        fetchTimeEntries(token);
      } else {
        throw new Error('Failed to update time entry');
      }
    } catch (error) {
      console.error('Error updating time entry:', error);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`/api/timeentry/${entryId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          fetchTimeEntries(token);
        } else {
          throw new Error('Failed to delete time entry');
        }
      } catch (error) {
        console.error('Error deleting time entry:', error);
      }
    }
  };
  const calculateWeeklyHours = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)));
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weekEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.clockIn);
      return entryDate >= startOfWeek && entryDate <= endOfWeek;
    });

    const totalHours = weekEntries.reduce((acc, entry) => {
      const clockIn = new Date(entry.clockIn);
      const clockOut = entry.clockOut ? new Date(entry.clockOut) : new Date();
      return acc + (clockOut - clockIn) / (1000 * 60 * 60);
    }, 0);

    setWeeklyHours(totalHours);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const handleAddEntry = () => {
    setNewEntry({ clockIn: '', clockOut: '' });
    setShowAddModal(true);
  };

  const handleSubmitNewEntry = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/timeentry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'manualEntry',
          clockIn: newEntry.clockIn,
          clockOut: newEntry.clockOut
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchTimeEntries(token);
      } else {
        throw new Error('Failed to add manual time entry');
      }
    } catch (error) {
      console.error('Error adding manual time entry:', error);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {user && (
        <p className="mb-4">Welcome, {user.name}!</p>
      )}

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 ${activeTab === 'timeTracking' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('timeTracking')}
          >
            Time Tracking
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'paycheck' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('paycheck')}
          >
            Paycheck Calculator
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'reports' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'search' ? 'border-b-2 border-blue-500' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Search
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 'timeTracking' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Time Tracking</h2>
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={handleClockInOut}
                  className={`px-4 py-2 rounded ${
                    isWorking ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  {isWorking ? 'Clock Out' : 'Clock In'}
                </button>
                <span className="text-gray-600">
                  Status: {isWorking ? 'Working' : 'Not working'}
                </span>
              </div>
              {isWorking && (
                <p className="mb-4 text-sm text-gray-600">
                  Current shift duration: {formatDuration(currentShiftDuration)}
                </p>
              )}
              {lastClockEvent && (
                <p className="mb-4 text-sm text-gray-600">
                  Last {isWorking ? 'clock-in' : 'clock-out'}: {formatDate(lastClockEvent)}
                </p>
              )}
              <p className="mb-4 text-sm text-gray-600">
                Total hours this week: {weeklyHours.toFixed(2)}
              </p>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Time Entries</h3>
                <button
                  onClick={handleAddEntry}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  Add Manual Entry
                </button>
              </div>
              <ul className="space-y-2">
                {timeEntries.map((entry) => (
                  <li key={entry._id} className="bg-gray-100 p-3 rounded shadow">
                    <p className="font-semibold">
                      {entry.clockOut ? 'Completed Shift' : 'Ongoing Shift'}
                    </p>
                    <p>Clock In: {formatDate(entry.clockIn)}</p>
                    {entry.clockOut && <p>Clock Out: {formatDate(entry.clockOut)}</p>}
                    {entry.clockOut && (
                      <p className="text-sm text-gray-600">
                        Duration: {((new Date(entry.clockOut) - new Date(entry.clockIn)) / (1000 * 60 * 60)).toFixed(2)} hours
                      </p>
                    )}
                    <div className="mt-2">
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'paycheck' && <PaycheckCalculator />}
          {activeTab === 'reports' && <ReportGenerator />}
          {activeTab === 'search' && <Search />}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Edit Time Entry</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Clock In
              </label>
              <input
                type="datetime-local"
                value={editingEntry.clockIn.slice(0, 16)}
                onChange={(e) => setEditingEntry({...editingEntry, clockIn: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Clock Out
              </label>
              <input
                type="datetime-local"
                value={editingEntry.clockOut ? editingEntry.clockOut.slice(0, 16) : ''}
                onChange={(e) => setEditingEntry({...editingEntry, clockOut: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleUpdateEntry}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
 {/* Add Manual Entry Modal */}
 {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Add Manual Time Entry</h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Clock In
              </label>
              <input
                type="datetime-local"
                value={newEntry.clockIn}
                onChange={(e) => setNewEntry({...newEntry, clockIn: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Clock Out
              </label>
              <input
                type="datetime-local"
                value={newEntry.clockOut}
                onChange={(e) => setNewEntry({...newEntry, clockOut: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSubmitNewEntry}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;